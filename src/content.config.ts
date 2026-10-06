import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
// Astro 7 deprecates re-exporting `z` from astro:content; import it directly
// from the copy Astro already ships so versions can never drift.
import { z } from "astro/zod";

/**
 * Content collections.
 *
 * The schemas below are enforced at build time: a typo in a frontmatter key,
 * a missing summary, or a bad URL fails `astro build` rather than shipping a
 * broken card. Adding a project is one markdown file — nothing else changes.
 */

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    /** One line, shown on the index card. Keep it under ~120 characters. */
    summary: z.string(),
    year: z.number().int(),
    stack: z.array(z.string()).default([]),
    status: z.enum(["active", "shipped", "paused"]).default("shipped"),
    /** Featured projects lead the index; the rest fall below the rule. */
    featured: z.boolean().default(false),
    /** Lower sorts first within a group. */
    order: z.number().default(100),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    /** Drafts are excluded from both the index and route generation. */
    draft: z.boolean().default(false),
  }),
});

/**
 * Everything I've read or watched. One JSON array rather than a file per item:
 * entries are small, numerous, and written by `scripts/shelf.mjs` (usually via
 * an agent), which keeps the file sorted and pre-validated. The schema here is
 * the backstop — a hand edit that breaks it fails the build.
 */
const shelf = defineCollection({
  loader: file("src/data/shelf.json"),
  schema: z.object({
    type: z.enum(["book", "film", "tv"]),
    title: z.string(),
    /** Author, director, or network — whoever the work is "by". */
    creator: z.string().optional(),
    series: z.string().optional(),
    seriesNumber: z.number().optional(),
    /** TV only: each season is its own entry. */
    season: z.number().int().optional(),
    status: z.enum(["finished", "in-progress", "queued", "abandoned"]),
    /** Quarter steps — 4.75 is a real opinion. */
    rating: z.number().min(0.25).max(5).multipleOf(0.25).optional(),
    finished: z.coerce.date().optional(),
    /** True when `finished` is only when it was logged, not when it was read. */
    dateApprox: z.boolean().default(false),
    added: z.coerce.date().optional(),
    /** Year the work came out. */
    year: z.number().int().optional(),
    pages: z.number().int().optional(),
    /** Minutes — a film's length, or a TV episode's. */
    runtime: z.number().int().optional(),
    episodes: z.number().int().optional(),
    cover: z.string().optional(),
    /** Spine colour, sampled from the cover by the shelf script. */
    color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    review: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

export const collections = { projects, shelf };
