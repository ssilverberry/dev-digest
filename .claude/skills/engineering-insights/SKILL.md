---
name: engineering-insights
description: >-
  Records non-obvious engineering discoveries into the touched package's INSIGHTS.md
  (client, server, reviewer-core, e2e). Use the moment you hit something a future
  session would otherwise relearn — a gotcha, a working approach, a dead-end
  antipattern, a codebase convention, a tool/library quirk, a recurring error + fix,
  or an open question — and again at the end of a substantive session, on "wrap up" /
  "retro", or when /engineering-insights is invoked. Reads the existing file first,
  never duplicates, writes only substantial file-grounded entries, and is strictly
  append-only (never overwrites). Trigger phrases: learned, discovered, realized,
  unexpected, gotcha, workaround, turns out, figured out, session wrap-up,
  engineering notes, non-obvious.
---

# Engineering Insights Recorder

Capture durable, non-obvious discoveries into the **`INSIGHTS.md` of the package the work
touched**, so the next session doesn't relearn them. Read what's already there, add only what
is new and substantial, and **never overwrite** — this skill is strictly append-only.

Insights live at the **package root**: `client/INSIGHTS.md`, `server/INSIGHTS.md`,
`reviewer-core/INSIGHTS.md`, `e2e/INSIGHTS.md`. The repo-root `INSIGHTS.md` is a separate
human-curated log — **this skill never writes to it.**

---

## 1. Gate check — is this session worth recording?

Run when any of these apply:

- Behavior that was **not** obvious from reading the relevant code for 5 minutes.
- A **dead end** — something that did not work, and the exact reason.
- A library/tool/CLI that behaved differently than documented.
- An architectural decision made with a concrete reason ("chose X because Y").
- A recurring error whose root cause became clear.
- A substantive session (a real problem tackled with an outcome).
- The user invoked `/engineering-insights`.

**Skip silently** (write nothing) for trivial sessions: a typo, rename, formatting-only change,
comment edit, or any session with no non-obvious discovery. If nothing survives the gate, stop
and say so in one line.

---

## 2. Detect the touched module(s)

From the files read or modified this session, route to the owning package's file:

| Path prefix | Module | Target file |
|-------------|--------|-------------|
| `client/` | client (`@devdigest/web`) | `client/INSIGHTS.md` |
| `server/` | server (`@devdigest/api`) | `server/INSIGHTS.md` |
| `reviewer-core/` | reviewer-core (`@devdigest/reviewer-core`) | `reviewer-core/INSIGHTS.md` |
| `e2e/` | e2e (`@devdigest/e2e`) | `e2e/INSIGHTS.md` |

Write to each module meaningfully touched. Work that spans packages → write the part relevant to
each, into each file. Root-only changes (`scripts/`, `docker-compose.yml`, CI) → attribute to the
most-affected module, or skip if it's not a module insight. **Never write the repo-root
`INSIGHTS.md`.**

---

## 3. Rank candidate insights (cap at 5 per module)

Collect candidates in priority order:

1. **User corrections** — the user said "no, not like that" or corrected a mistake.
2. **Failed approaches** — a path tried that didn't work, with the exact reason.
3. **Repeated patterns** — the same issue appeared 2+ times this session.
4. **Non-obvious solutions** — it worked, but required investigation to find.
5. **Workflow discoveries** — process/tool behavior learned by doing.

---

## 4. Quality filter

For each candidate ask: **"Would this be obvious to anyone reading the relevant code for 5
minutes?"** If yes → discard. Also discard: vague statements without a specific fact, generic
programming advice not specific to this codebase, pure process notes ("I ran the tests"), and
anything already captured in the target file.

| ❌ Discard | ✅ Keep |
|-----------|--------|
| "Promises can be tricky" | "`Promise.all()` on the review pipeline times out past ~30 items — batch with `Promise.allSettled()` in groups of 10. Evidence: `reviewer-core/src/review/run.ts:NN`" |
| "Be careful with secrets" | "`SecretsProvider` is the ONLY reader of `process.env` — inject it, never read env directly in a module. Evidence: `server/src/platform/container.ts:NN`" |
| "The server uses Fastify" | "New feature = new module + one line in `server/src/modules/index.ts`; there is no filesystem autoload. Evidence: `server/src/modules/index.ts:NN`" |

---

## 5. Classify into one of the 7 sections

Every `INSIGHTS.md` has these fixed section headers — append each entry under the right one:

| Section | Use for |
|---------|---------|
| **What Works** | An approach/pattern confirmed effective in this codebase. |
| **What Doesn't Work** | Dead ends + the exact reason. *Highest-value, most-skipped — prioritize it.* |
| **Codebase Patterns** | Conventions, DI wiring, architectural decisions with rationale ("X because Y"). |
| **Tool & Library Notes** | Dependency quirks, CLI behavior, test-infra specifics. |
| **Recurring Errors & Fixes** | A common error + its root cause + the exact fix. |
| **Session Notes** | One dated summary per substantive session (`### YYYY-MM-DD` subheading). |
| **Open Questions** | Unresolved items with enough context to resume later. |

When ambiguous, prefer **What Doesn't Work** over What Works. Decisions-with-rationale →
**Codebase Patterns**.

---

## 6. Entry format

Every entry must be specific and locatable. For all sections except Session Notes, append a
bullet under the matching `##` header:

```
- **YYYY-MM-DD** — <concrete, actionable fact specific to this codebase>. Evidence: `path/file.ts:NN`.
```

The `Evidence: file:line` anchor is mandatory for What Works / What Doesn't Work / Codebase
Patterns / Tool & Library Notes / Recurring Errors & Fixes.

**Session Notes** group under a dated subheading instead:

```
### YYYY-MM-DD
- <what the session tackled → the outcome/decision, one line per point>. Files: path1, path2.
```

**Open Questions** carry resume context:

```
- **YYYY-MM-DD** — <question with enough context to resume>. Investigated in: `path/file.ts:NN`.
```

---

## 7. Read first, then create-if-missing

**Read the target `INSIGHTS.md` in full before drafting.** Drop any candidate already captured
(exact duplicate or substantively the same fact).

If the file does **not** exist, create it from this template (substitute the module name), then
append into it:

```markdown
# INSIGHTS — {module}

Append-only log of non-obvious discoveries in this package, captured by the
`engineering-insights` skill. Newest entries at the bottom of each section. Keep entries
short, concrete, and file-grounded.

## What Works

## What Doesn't Work

## Codebase Patterns

## Tool & Library Notes

## Recurring Errors & Fixes

## Session Notes

## Open Questions
```

---

## 8. Append — never overwrite (hard rule)

This skill is **append-only** and must never clobber existing content:

- **Re-read the target file immediately before writing** — its state may have changed since the
  session began.
- **Use an anchored `Edit`** that inserts the new bullet under the correct `##` header. **Never
  use `Write` on an existing `INSIGHTS.md`** — `Write` replaces the whole file and would destroy
  prior content. (`Write` is only acceptable to *create* the file when it doesn't exist yet.)
- **Preserve verbatim** the header, preamble, every section heading, and every existing entry.
  New content is only ever *added*.
- If a section header is missing, add it (in the canonical order) before appending.
- **Corrections are additive** — supersede a wrong entry with a new dated note (in Recurring
  Errors & Fixes or What Works); never edit or delete the original. A resolved Open Question gets
  a resolution entry elsewhere; leave the original question in place.
- **Idempotent** — if an equivalent entry already exists, skip it.

---

## 9. Output report

After writing, report concisely:

1. Which modules received entries.
2. Count of entries written per module, by section.
3. Entries discarded by the quality filter, one line each with the reason.
4. Open questions recorded.

Do not print the full `INSIGHTS.md` content unless asked.

---

## Maintenance (out of band, not per-session)

Append-only means the files grow. Keep them lean between sessions: prune fixed-bug, duplicate,
and never-needed entries; aim for ~30 high-value entries per file before splitting into domain
files (e.g. `INSIGHTS-db.md`). Treat entries as a reviewed draft — an incorrect entry propagates
to every future session until corrected.
