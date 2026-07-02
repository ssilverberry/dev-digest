---
description: Capture non-obvious discoveries from this session into the touched package's INSIGHTS.md (append-only).
---

Invoke the `engineering-insights` skill now.

Run its full algorithm on the current session: gate-check whether the session was substantial,
detect which package(s) were touched (`client/`, `server/`, `reviewer-core/`, `e2e/`), rank and
quality-filter candidate insights, read the target `<package>/INSIGHTS.md` first to avoid
duplicates, then **append** the survivors under the correct section using the skill's entry
format. Writes are strictly append-only — use an anchored `Edit`, never `Write`, on an existing
file. Never write the repo-root `INSIGHTS.md`.

If the session was trivial or nothing survives the quality filter, write nothing and say so.
Finish with the skill's short output report (modules written, entries per section, entries
discarded and why).
