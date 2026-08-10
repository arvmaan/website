import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
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

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
