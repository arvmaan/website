import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

import { SITE } from "./src/consts";

export default defineConfig({
  site: SITE.url,

  integrations: [
    mdx(),
    sitemap({
      // The preserved Jekyll page is personal, not something to index.
      filter: (page) => !page.includes("/valentine"),
    }),
  ],

  build: {
    // Emit `/projects/index.html` rather than `/projects.html`, so the legacy
    // flat files kept in public/ (valentine.html, teamgen.html) hold their
    // original URLs without ever colliding with a generated route.
    format: "directory",
  },

  vite: {
    build: {
      // The scene video is already compressed — don't let Vite inline it.
      assetsInlineLimit: 0,
    },
  },
});
