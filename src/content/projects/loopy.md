---
title: Loopy
summary: Breaks a task into composable blocks, then loops a coding agent through them with review gates.
year: 2026
stack: ["Rust", "WebSockets"]
status: active
featured: true
order: 2
repo: https://github.com/arvmaan/loopy
---

One enormous prompt is a bad way to run a long task. The agent loses the thread,
and you lose any place to intervene before it has already committed to an
approach.

Loopy makes the structure explicit. Every task becomes an ordered **pipeline of
blocks** — small single-purpose steps like *Recon*, *Flight Plan*, *Build*,
*Red Team*, *Land*. You describe what you want, Loopy proposes a pipeline, you
reorder or drop blocks in the browser, and it executes.

## What it does

- **17 built-in blocks** across Understand, Design, Build, Review, and Ship
- **Agent-agnostic** — works with any agent CLI that runs non-interactively,
  defaulting to `claude`
- **Human-in-the-loop** — the pipeline pauses at review gates, where you approve
  or send feedback that loops back into the step
- **Resumable** — state is checkpointed to disk, so you can stop the server and
  pick up where you left off
- **Browser UI** — plan, edit, and watch pipelines run live over a WebSocket

## Filesystem-native by choice

Loopy spawns the agent loop, the agent writes JSONL events, and a watcher picks
them up. There is no bespoke IPC channel between the two processes.

That sounds primitive and is the reason it holds together: the boundary is a
file format instead of a protocol, which means an agent that knows nothing about
Loopy still works with it, and a crashed process leaves a readable trail rather
than a lost session.
