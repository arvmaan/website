---
title: Post template
description: Copy this file, rename it, flip draft to false.
published: 2026-08-09
tags: ["rust", "tooling"]
draft: true
---

This file exists as a starting point, not as content. It is `draft: true`, so it
is excluded from the index and no route is generated for it.

To publish a post: copy this file to `src/content/writing/your-slug.md`, fill in
the frontmatter, write, and set `draft: false`. The filename becomes the URL —
this one would be `/writing/your-slug/`.

## Frontmatter

`title`, `description`, and `published` are required; the build fails without
them. `tags` and `updated` are optional. Dates are plain `YYYY-MM-DD`.

## What you get

Standard markdown. Headings, **bold**, `inline code`, links, lists, blockquotes,
and fenced code blocks are all styled in `src/styles/global.css` and in the post
layout.

```rust
fn main() {
    println!("syntax highlighting works out of the box");
}
```

Rename the extension to `.mdx` if a post ever needs a component embedded in it.
