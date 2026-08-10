# arv.tw

Personal site. Astro + TypeScript, static output, deployed to GitHub Pages.
Repo: `arvmaan/website`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve dist/ exactly as it will be served in production
npm run check    # typecheck .astro and .ts files
```

Requires Node 22+.

---

## How it's laid out

```
public/            copied to dist/ verbatim, no processing
  scene.mp4          background footage
  scene-poster.jpg   first frame — poster, OG image, and inner-page backdrop
  CNAME              custom domain (must live here, not at the repo root)
  valentine.html     preserved from the old Jekyll site
  teamgen.html       preserved from the old Jekyll site
  assets/            sprites, sounds, and compiled CSS those two pages need

src/
  consts.ts          site title, hero copy, nav — edit strings here
  content.config.ts  frontmatter schemas, enforced at build time
  content/
    projects/*.md    one file per project
    writing/*.md     one file per post
  data/archive.ts    older repos, listed but without their own pages
  layouts/Base.astro <head>, backdrop, header, skip link
  components/        Backdrop, SiteNav, PageHeader
  pages/             file path = URL
  styles/            global.css (tokens) and prose.css (markdown output)
```

**File-based routing.** A file in `src/pages/` becomes a URL:
`src/pages/projects/index.astro` → `/projects/`. Square brackets mean dynamic:
`[...slug].astro` generates one page per collection entry.

**Everything is static.** `astro build` renders every page to HTML at build time.
There is no server and no client-side framework. The only JavaScript shipped is
the handful of lines in `Backdrop.astro` that pause the video.

---

## Adding a project

Create `src/content/projects/my-thing.md`:

```markdown
---
title: My Thing
summary: One line, under about 120 characters.
year: 2026
stack: ["Rust"]
status: active # active | shipped | paused
featured: true
order: 6 # lower sorts first
repo: https://github.com/arvmaan/my-thing
demo: https://example.com # optional
draft: false
---

Write the body in markdown.
```

That's the whole job — the index row and the `/projects/my-thing/` page both
appear automatically. The schema in `src/content.config.ts` is enforced, so a
missing `summary` or a malformed URL **fails the build** instead of shipping
broken. Set `draft: true` to keep something out of the build entirely.

Adding a post works the same way in `src/content/writing/`; copy `_template.md`.

---

## The preserved Jekyll pages

`valentine.html` and `teamgen.html` came from the old Jekyll site and are served
unchanged at their original URLs:

- `/valentine.html`
- `/teamgen.html`

Both carried their own `<style>` and `<script>` and only ever needed a document
wrapper from Jekyll's layout, so they were converted to standalone HTML and
dropped into `public/`, which Astro copies through untouched. The SCSS they
referenced was compiled once to `public/assets/css/styles.css`.

They are deliberately **not** Astro pages. Nothing in the build touches them, so
nothing in the build can break them.

`valentine.html` carries `<meta name="robots" content="noindex">` and is excluded
from the sitemap, since it's personal rather than portfolio content. Remove both
if you'd rather it be indexed.

---

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `master`.
It needs **Settings → Pages → Source: GitHub Actions** set once on the repo.

### Cutting over to arv.tw

`public/CNAME` still reads `arvindmaan.dev` — deliberately, so nothing goes dark
by accident. `arv.tw` is registered at Porkbun but was still on parking DNS as of
2026-08-09.

**Order matters: DNS first, `CNAME` second.** Once DNS points at GitHub while
`CNAME` still reads `arvindmaan.dev`, nothing breaks — the old domain keeps
serving and `arv.tw` simply 404s from GitHub until it's claimed.

1. At Porkbun, delete the parking records (`ALIAS` root → `pixie.porkbun.com`,
   `CNAME www` → `pixie.porkbun.com`).
2. Add apex `A` records to `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`, plus `AAAA` to `2606:50c0:8000::153`
   through `2606:50c0:8003::153`. Add `CNAME www` → `arvmaan.github.io.`
3. Wait for propagation, and confirm with `dig +short arv.tw A`.
4. Change `public/CNAME` to `arv.tw` and push.
5. Repo **Settings → Pages** → set the custom domain, then enable **Enforce
   HTTPS** once the certificate is issued.

GitHub Pages allows exactly **one** custom domain per repository, so
`arvindmaan.dev` will not redirect on its own. Keep old links alive with a
redirect rule at the registrar or a small separate repo.

---

## Notes

- **Performance.** The home page decodes one 2.7 MB video; every other page uses
  the 108 KB poster still and decodes nothing. The video pauses on a hidden tab
  and never plays under `prefers-reduced-motion`.
- **The grain.** A full-viewport blended layer, and the most expensive thing on
  the page. It's also what stops the upscaled footage reading as low resolution.
  If a device struggles, turn `--grain-opacity` down before touching anything
  else.
- **Colour grade.** Lives in `src/styles/global.css` as `--scene-*` tokens, so
  regrading is one place.
- **Fonts.** System stacks for now; `--font-display` resolves to New York on
  Apple platforms. To upgrade, self-host a woff2 and prepend it to that token —
  nothing else needs to change.
- **History.** The full Jekyll site is preserved in git at `27d26b0`.
