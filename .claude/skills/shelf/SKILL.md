---
name: shelf
description: Log, rate, or edit books, films, and TV on the /shelf page of arv.tw. Use when Arvind says he finished, started, wants to read/watch, rated, reviewed, or dropped something — e.g. "finished Project Hail Mary, 4.5, loved Rocky", "started Severance s2", "add Dune 2 to watch later", "bump Golden Son to 5".
---

# Shelf

The /shelf page is built from `src/data/shelf.json`. Never hand-edit that file —
every change goes through `npm run shelf -- …` (`scripts/shelf.mjs`), which
validates, keeps it sorted, downloads covers into `public/shelf/`, and samples
the spine colour.

## Flow

1. **Parse the request.** Pull out: type (book / film / tv), title, status,
   rating (0.25–5 in quarter steps — "4.5" and "4.75" are fine, so is "loved it" → ask or infer
   conservatively), finish date (default today; "last week" → resolve to a date),
   and any review text. One message may log several things.

2. **Check whether it already exists:** `npm run shelf -- list "<words>"`.
   If it does, use `set` rather than `add` (e.g. queued → finished).

3. **Find metadata** for anything new:
   `npm run shelf -- find book|film|tv "<title + author/year if known>"`.
   - Pick the obvious match yourself. Only ask when it is genuinely ambiguous
     (two films with the same name, a remake). Prefer the original edition.
   - Books: Open Library's `pages` is a median and can be off; fine to keep.
   - Films: Wikipedia gives no runtime — fill `runtime` (minutes) from your own
     knowledge when you're confident, otherwise leave it out.
   - TV: log **one entry per season**, with `season`, `episodes`, and the show's
     `runtime`; use the season's `coverUrl`, falling back to the show's.

4. **Write it:**
   ```bash
   npm run shelf -- add '{"type":"book","title":"…","creator":"…","status":"finished","rating":4.5,"finished":"2026-10-05","year":2021,"pages":496,"coverUrl":"…","link":"…","review":"…"}'
   npm run shelf -- set <id> rating=5 status=finished finished=2026-10-05
   npm run shelf -- set <id> 'review=Paragraph one.

   Paragraph two.'
   npm run shelf -- rm <id>
   ```
   Statuses: `finished`, `in-progress`, `queued`, `abandoned` (didn't finish —
   shown as a leaning spine). Series go in `series` + `seriesNumber`.
   Reviews: keep his words; fix only obvious typos. Never invent a review.

5. **Verify:** `npm run build` must pass (the content schema is the backstop).

6. **Publish:** commit only the shelf changes (`src/data/shelf.json`,
   `public/shelf/`) with a message like `Shelf: finished Project Hail Mary (4.5)`
   and push to `master` — the GitHub Action deploys it. Asking to log something
   is the go-ahead to publish it; the page is public, so if a review mentions
   other people or anything private, check before pushing.

7. **Report in one or two lines**: what was logged, and anything you guessed
   (date, edition, runtime) so he can correct it.
