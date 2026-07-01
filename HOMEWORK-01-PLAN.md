# Homework 01 — Plan (checklist)

Merges: mentor's step-by-step, the GoIT homework page, and the current state of this repo.

## Feature to build
**Severity counters on the PR page.** Show finding counts by severity, e.g. `3 CRITICAL · 5 WARNING · 2 SUGGESTION`. Clicking a level filters the findings list to only that severity. **No LLM calls** — pure UI over existing data. (This is the homework feature; the Run Cost Badge was the lab, already done in class.)

---

## A. Git setup (one-time)
- [ ] Confirm this local repo is a fork of `github.com/burnjohn/dev-digest` (mentor: one fork for the whole course). If not, Fork it on GitHub and re-clone.
- [ ] Create the homework branch: `git checkout -b feat/lesson-01`

## B. Lab artifacts that are MISSING here (homework acceptance needs them)
- [ ] Write **`CLAUDE.md` v1** at repo root — project constitution, ≤100 lines (stack+versions, build/test commands, top-level map, do-not-touch zones, "read when…" pointers). *(Currently absent — only a fixture copy exists under `server/clones/...`.)*
- [ ] Create the **`engineering-insights` skill** in `.claude/skills/` + a `/engineering-insights` command in `.claude/commands/`. *(Currently absent.)*
- [ ] Create **`INSIGHTS.md`** (append-only lessons file with fixed sections: What Works / What Doesn't / Codebase Patterns / Tool & Library Notes / Recurring Errors & Fixes / Session Notes / Open Questions). *(Currently absent.)*
- [ ] (Optional, from lab) add `docs/architecture.md` + a `specs/` folder if you want full lab parity.
- [ ] (L06 preview — optional now) set up a **Stop hook** so insights get written automatically.

## C. Repo exploration
- [ ] Run the project locally (Postgres in Docker, `pnpm dev` for server + client) and click through the PR flow.
- [ ] Ask Claude for a repo tour; note anything non-obvious into `INSIGHTS.md`.

## D. Build the feature through the 5 phases
- [ ] **Phase 1 — Plan mode:** have Claude produce a plan for the severity counter (reuse existing `FindingsPanel` / `FindingCard` components — the severity UI already exists).
- [ ] **Phase 2 — Approve the plan** before any code is written.
- [ ] **Phase 3 — Implement:** counts by severity + click-to-filter. Empty/no-data state shows nothing meaningful, not fake `0`s where inappropriate.
- [ ] **Phase 4 — Verify:** click through the UI + run tests. Confirm **no new LLM calls in the logs**.
- [ ] **Phase 5 — Commit** and open the Pull Request.

## E. Insights check
- [ ] After the session, check `INSIGHTS.md` for a new entry from the skill.
- [ ] If it didn't fire, run `/engineering-insights` manually to record the session.

## F. Problem hunt (reviewers)
- [ ] Confirm the `demo/*` branches are present (they are: `demo/security-review-fixture`, `demo/agent-summary-endpoint`, `demo/repo-activity-summary`, `demo/review-share-webhook`). If demo PRs didn't carry over, ask Claude to recreate them.
- [ ] Run the base reviewer agent on one demo PR; note how useful the insights are.
- [ ] Re-run the same review/prompt via Claude Code; tweak the prompt, re-save the agent, compare.
- [ ] *(Stretch)* Add another repo and run the reviewers on it.

## G. Pull Request + submission
- [ ] Open PR **`feat/lesson-01` → `main` in YOUR OWN fork** (not burnjohn's).
- [ ] PR description covers: what was built + a short report on how well the insights worked.
- [ ] Record a **screencast video** of the counter working (click a level → list filters).
- [ ] Submit on GoIT: **PR link + screencast video**.

## Acceptance criteria (self-check before submitting)
- [ ] Counter works; counts match the findings list.
- [ ] No new LLM calls in logs.
- [ ] Open PR with a good description + demo video.
- [ ] `INSIGHTS.md` has an entry for this session.
- [ ] Repo contains `CLAUDE.md`, `INSIGHTS.md`, `docs`, `specs` from the lab.
