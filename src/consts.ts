/**
 * Single source of truth for site-wide strings.
 *
 * Imported by astro.config.mjs as well as pages, so keep it dependency-free
 * and free of any `astro:` imports — the config is evaluated before those
 * virtual modules exist.
 */

export const SITE = {
  url: "https://arv.tw",
  title: "Arvind Maan",
  /** Used as the <meta name="description"> fallback and in the sitemap. */
  description:
    "Arvind Maan — software engineer in Vancouver, building observability at AWS CloudWatch Logs.",
  locale: "en",
} as const;

export const HERO = {
  name: "Arvind Maan",
  // En dash rather than a hyphen: this is a phrase break, not a compound word,
  // and at display size a hyphen reads as a typo.
  tagline: "Software Engineer – Currently building for AWS CloudWatch Logs",
  sub: "Working on all things observability",
} as const;

/** Top-level navigation. External entries open in a new tab. */
export const NAV = [
  { label: "Projects", href: "/projects/" },
  { label: "Writing", href: "/writing/" },
  { label: "GitHub", href: "https://github.com/arvmaan", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arvindmaan",
    external: true,
  },
] as const;
