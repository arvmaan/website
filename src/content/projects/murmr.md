---
title: murmr
summary: Voice dictation that doesn't stop at transcription — it shapes what you said into a prompt worth sending.
year: 2026
stack: ["Rust", "Whisper"]
status: active
featured: true
order: 1
repo: https://github.com/arvmaan/murmr
---

**Speak sloppy, prompt sharp.**

Talking to a coding agent well is a writing problem. You know what you want, but
typing it out precisely is slow, and saying it out loud produces something too
loose to be useful. murmr closes that gap: hold a hotkey, say the messy version,
release, and it hands back a structured prompt.

Transcription runs locally through Whisper, so nothing leaves the machine on its
way to becoming text.

## The design decision that matters

murmr deliberately does not answer the question.

Given "can you help me figure out why the login page is really slow, i think
it's the api calls but not sure, dig into it and fix it", the obvious move is to
start debugging. murmr instead compiles that into a task and its context, and
stops:

```
TASK: Investigate and fix the performance issues on the login page, with focus
on API call optimization.
CONTEXT: The login page is slow; API calls are suspected as the primary
bottleneck but the root cause needs confirmation.
```

That output goes to whichever agent you were going to use anyway. The point is
to make the ask precise, not to take over the work — you stay the driver, and
the tool that is good at building prompts stays separate from the tool that is
good at writing code.
