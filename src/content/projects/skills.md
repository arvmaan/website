---
title: skills
summary: Provider-neutral agent skills — installable into Claude Code, Codex, Cursor, or anything else that speaks the spec.
year: 2026
stack: []
status: active
featured: true
order: 3
repo: https://github.com/arvmaan/skills
---

Every agent CLI ends up re-deriving the same handful of behaviors — git
workflow hygiene, standing defaults for surgical changes, routing long work
across sessions. Writing that judgment once per tool doesn't scale, and it
drifts out of sync the moment it does.

skills packages it as installable `SKILL.md` files, grouped by category, that
any agent supporting the [Agent Skills spec](https://agentskills.io) can pick
up via `npx skills` — no company-internal tooling baked in, so it installs
the same way anywhere.

## What's in it

- **herdr** — driving fleets of coding agents through the
  [herdr](https://herdr.dev) terminal workspace manager
- **git-workflow** — shipping a feature branch: comment hygiene, PR prep
- **principles** — standing behavioral defaults: minimum viable change,
  surgical edits, calculated tool/token use
- **workflow** — routing substantial work across sessions, workers,
  worktrees, and handoffs
