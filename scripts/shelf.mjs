#!/usr/bin/env node
/**
 * shelf — the one way entries get into src/data/shelf.json.
 *
 * Built to be driven by an agent (see .claude/skills/shelf/SKILL.md) but
 * perfectly usable by hand. Every write re-sorts and re-validates the file,
 * so the JSON never drifts into a shape the site's schema would reject.
 *
 *   node scripts/shelf.mjs find <book|film|tv> "<query>"   candidates as JSON
 *   node scripts/shelf.mjs add '<json>'                    add one entry
 *   node scripts/shelf.mjs set <id> key=value ...          edit fields
 *   node scripts/shelf.mjs rm <id>                         remove an entry
 *   node scripts/shelf.mjs list [text]                     search what's there
 *   node scripts/shelf.mjs covers                          fetch remote covers, resample colours
 *
 * Metadata sources need no API keys: Open Library (books), Wikipedia (films),
 * TVmaze (TV). Covers are downloaded into public/shelf/ rather than hotlinked,
 * so the page never depends on someone else's CDN staying put. `sharp` is not
 * a declared dependency: it comes in with Astro, which uses it for images.
 */

import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/shelf.json");
const COVERS = path.join(ROOT, "public/shelf");
const UA = { "User-Agent": "arv.tw-shelf/1.0 (https://arv.tw)" };

const TYPES = ["book", "film", "tv"];
const STATUSES = ["finished", "in-progress", "queued", "abandoned"];
/** Field order in the file — keeps diffs readable when an agent edits it. */
const KEYS = [
  "id", "type", "title", "creator", "series", "seriesNumber", "season",
  "status", "rating", "finished", "dateApprox", "added", "year", "pages",
  "runtime", "episodes", "cover", "color", "review", "link",
];

// --- io ---------------------------------------------------------------------

const load = async () => JSON.parse(await readFile(DATA, "utf8"));

async function save(entries) {
  entries.forEach(validate);
  // Newest activity first; queued items (no finish date) by when they were added.
  entries.sort((a, b) =>
    (b.finished ?? b.added ?? "").localeCompare(a.finished ?? a.added ?? ""),
  );
  const ordered = entries.map((e) =>
    Object.fromEntries(KEYS.filter((k) => e[k] !== undefined && e[k] !== null).map((k) => [k, e[k]])),
  );
  await writeFile(DATA, JSON.stringify(ordered, null, 2) + "\n");
}

function validate(e) {
  const fail = (msg) => { throw new Error(`${e.id ?? e.title}: ${msg}`); };
  if (!e.id || !/^[a-z0-9-]+$/.test(e.id)) fail("id must be a lowercase slug");
  if (!TYPES.includes(e.type)) fail(`type must be one of ${TYPES.join(", ")}`);
  if (!e.title) fail("title is required");
  if (!STATUSES.includes(e.status)) fail(`status must be one of ${STATUSES.join(", ")}`);
  if (e.rating != null && !(e.rating >= 0.25 && e.rating <= 5 && e.rating * 4 === Math.round(e.rating * 4)))
    fail("rating must be 0.25–5 in quarter steps");
  for (const k of ["finished", "added"])
    if (e[k] != null && !/^\d{4}-\d{2}-\d{2}$/.test(e[k])) fail(`${k} must be YYYY-MM-DD`);
  if (e.status === "finished" && !e.finished) fail("finished entries need a finished date");
}

const slug = (s) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const today = () => new Date().toLocaleDateString("en-CA");

async function getJSON(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} from ${url}`);
  return res.json();
}

// --- covers -----------------------------------------------------------------

/** Download a cover, store it locally, and sample a spine colour from it. */
async function fetchCover(id, url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`cover ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(COVERS, { recursive: true });
  const file = `${id}.jpg`;
  await sharp(buf).resize({ width: 360, withoutEnlargement: true }).jpeg({ quality: 82 })
    .toFile(path.join(COVERS, file));
  return { cover: `/shelf/${file}`, color: await spineColour(buf) };
}

/**
 * The colour a person would name for this cover. Most covers are dark, so the
 * plain "most common colour" is nearly always black; instead, bucket the
 * pixels and weight each bucket by how vivid it is as well as how common.
 */
async function spineColour(buf) {
  const { data } = await sharp(buf).resize(32, 48, { fit: "fill" }).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 3) {
    const key = (data[i] >> 4) << 8 | (data[i + 1] >> 4) << 4 | (data[i + 2] >> 4);
    const b = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    b.n++; b.r += data[i]; b.g += data[i + 1]; b.b += data[i + 2];
    buckets.set(key, b);
  }
  let best, bestScore = -1;
  for (const b of buckets.values()) {
    const r = b.r / b.n, g = b.g / b.n, bl = b.b / b.n;
    const max = Math.max(r, g, bl), min = Math.min(r, g, bl);
    const sat = max ? (max - min) / max : 0, val = max / 255;
    // Vivid-and-bright dominates; near-black and greys only win when the
    // cover has no real colour anywhere (a gold emblem on black reads as gold).
    const score = b.n * (0.08 + sat * val * 2) * (val < 0.15 ? 0.3 : 1);
    if (score > bestScore) { bestScore = score; best = [r, g, bl]; }
  }
  return "#" + best.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

/** Re-sample spine colours from the local covers, e.g. after tuning the picker. */
async function recolour(entries) {
  for (const e of entries.filter((x) => x.cover?.startsWith("/shelf/")))
    e.color = await spineColour(await readFile(path.join(ROOT, "public", e.cover)));
}

// --- find -------------------------------------------------------------------

async function findBook(q) {
  const fields = "key,title,author_name,first_publish_year,cover_i,number_of_pages_median";
  const { docs } = await getJSON(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=6&fields=${fields}`,
  );
  return docs.map((d) => ({
    type: "book",
    title: d.title,
    creator: d.author_name?.[0],
    year: d.first_publish_year,
    pages: d.number_of_pages_median,
    coverUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : undefined,
    link: `https://openlibrary.org${d.key}`,
  }));
}

async function findFilm(q) {
  // Bias the title search toward film articles; the summary call then gives
  // the poster and a description to disambiguate remakes and same-name films.
  const { pages } = await getJSON(
    `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(q + " film")}&limit=6`,
  );
  const out = [];
  for (const p of pages) {
    const s = await getJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.key)}`)
      .catch(() => null);
    if (!s || !/film|movie/i.test(s.description ?? "")) continue;
    out.push({
      type: "film",
      title: s.title.replace(/\s*\((\d{4} )?film\)$/i, ""),
      year: Number((s.description.match(/\b(19|20)\d{2}\b/) ?? [])[0]) || undefined,
      description: s.description,
      coverUrl: s.originalimage?.source ?? s.thumbnail?.source,
      link: s.content_urls?.desktop?.page,
    });
  }
  return out;
}

async function findTv(q) {
  const hits = await getJSON(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`);
  const out = [];
  for (const { show } of hits.slice(0, 3)) {
    const seasons = await getJSON(`https://api.tvmaze.com/shows/${show.id}/seasons`);
    out.push({
      type: "tv",
      title: show.name,
      creator: show.network?.name ?? show.webChannel?.name,
      year: Number(show.premiered?.slice(0, 4)) || undefined,
      runtime: show.averageRuntime ?? show.runtime,
      link: show.url,
      coverUrl: show.image?.original,
      seasons: seasons.map((s) => ({
        season: s.number,
        episodes: s.episodeOrder,
        year: Number(s.premiereDate?.slice(0, 4)) || undefined,
        coverUrl: s.image?.original,
      })),
    });
  }
  return out;
}

// --- commands ---------------------------------------------------------------

const commands = {
  async find(type, ...q) {
    const fn = { book: findBook, film: findFilm, tv: findTv }[type];
    if (!fn || !q.length) throw new Error('usage: find <book|film|tv> "<query>"');
    console.log(JSON.stringify(await fn(q.join(" ")), null, 2));
  },

  async add(json) {
    const input = JSON.parse(json);
    const entries = await load();
    const e = { status: "finished", added: today(), ...input };
    if (e.status === "finished" && !e.finished) e.finished = today();
    e.id ??= slug(e.type === "tv" && e.season ? `${e.title} s${e.season}` : e.title);
    if (entries.some((x) => x.id === e.id)) throw new Error(`"${e.id}" already exists — use set`);
    const coverUrl = e.coverUrl; delete e.coverUrl;
    if (coverUrl) Object.assign(e, await fetchCover(e.id, coverUrl));
    entries.push(e);
    await save(entries);
    console.log(JSON.stringify(e, null, 2));
  },

  async set(id, ...pairs) {
    const entries = await load();
    const e = entries.find((x) => x.id === id);
    if (!e) throw new Error(`no entry "${id}"`);
    for (const pair of pairs) {
      const i = pair.indexOf("=");
      const k = pair.slice(0, i), raw = pair.slice(i + 1);
      // Numbers and booleans arrive as strings on the command line; an empty
      // value clears the field.
      const v = raw === "" ? undefined : raw === "true" ? true : raw === "false" ? false
        : /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw;
      if (k === "coverUrl") Object.assign(e, await fetchCover(e.id, v));
      else e[k] = v;
    }
    if (e.status === "finished" && !e.finished) e.finished = today();
    await save(entries);
    console.log(JSON.stringify(e, null, 2));
  },

  async rm(id) {
    const entries = await load();
    const e = entries.find((x) => x.id === id);
    if (!e) throw new Error(`no entry "${id}"`);
    if (e.cover?.startsWith("/shelf/") && existsSync(path.join(ROOT, "public", e.cover)))
      await unlink(path.join(ROOT, "public", e.cover));
    await save(entries.filter((x) => x !== e));
    console.log(`removed ${id}`);
  },

  async list(...q) {
    const needle = q.join(" ").toLowerCase();
    for (const e of await load()) {
      const line = `${e.id.padEnd(40)} ${e.type.padEnd(4)} ${e.status.padEnd(11)} ${String(e.rating ?? "-").padEnd(3)} ${e.finished ?? ""}  ${e.title}${e.creator ? " — " + e.creator : ""}`;
      if (!needle || line.toLowerCase().includes(needle)) console.log(line);
    }
  },

  /** Localise any entry whose cover is still a remote URL (used by imports). */
  async covers() {
    const entries = await load();
    for (const e of entries.filter((x) => x.cover?.startsWith("http"))) {
      try {
        Object.assign(e, await fetchCover(e.id, e.cover));
        console.log(`✓ ${e.id}`);
      } catch (err) {
        console.error(`✗ ${e.id}: ${err.message}`);
      }
    }
    await recolour(entries);
    await save(entries);
  },
};

const [cmd, ...args] = process.argv.slice(2);
if (!commands[cmd]) {
  console.error("usage: shelf <find|add|set|rm|list|covers> …  (see header of scripts/shelf.mjs)");
  process.exit(1);
}
commands[cmd](...args).catch((err) => {
  console.error(`shelf: ${err.message}`);
  process.exit(1);
});
