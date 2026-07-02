# Group A — Run Cost Badge (handover for Claude Code)

**Goal:** surface USD cost + tokens for every agent run across the review UI. `reviewer-core` already computes `outcome.costUsd` (the server currently discards it) — this is re-plumbing, not new pricing logic. **Zero extra model calls.**

**Reference (verify shape, don't copy blindly):** `git show d186657` (full end-to-end re-intro) and `git show 7b38596` + `git show 93116cc` (COST column refinements). The starter removed cost in `d45ab0d` / `58c6ac7`.

## Server
1. **Migration:** re-add `cost_usd` (doublePrecision, nullable) to `agent_runs` in `server/src/db/schema/runs.ts`; run `pnpm db:generate`. (Reference used migration 0010.)
2. **Capture:** in `run-executor.ts` read `outcome.costUsd` and pass it to `repo.completeAgentRun(...)`; add `cost_usd` to `run.repo.ts` write. (See existing `tokensIn/tokensOut` handling for the pattern.)
3. **Contracts:** add `costUsd`/`cost_usd` to `RunStats` + `RunSummary` in `trace.ts`, and `last_run_cost_usd` to `PrMeta` in `platform.ts` — update **both** vendored copies (`server/src/vendor/shared/contracts` AND `client/src/vendor/shared/contracts`) in lock-step.
4. **Routes:** serialize `cost_usd` in `GET /pulls` and the run/trace GET routes. For the PR-list value use a `DISTINCT ON` (or SUM per PR — see below) subquery on `agent_runs`; no extra migration needed for read-side.

## Client
5. **`formatCost` util:** `null → "—"`, real `0 → "$0.00"`, otherwise 3 decimals (`$0.012`). Unify existing timeline/sidebar formatting to 3 decimals.
6. **`RunCostBadge` component** (`client/src/components/RunCostBadge/`): two variants — `compact` (`$0.012`) and `withTokens` (`$0.014 · 8.2K→1.3K`).
7. **Wire into 3 surfaces:** PR-list **COST** column (header + `PRRow` cell, `constants.ts` + `styles.ts`); Agent-runs timeline row in `RunHistory` (`tok · $cost`); Run Trace Stats **COST** card in `RunTraceDrawer`/`TraceBody`.
8. **i18n:** add COST labels to `client/messages/en/prReview.json` + `runs.json`.

## Decisions to confirm before coding
- **PR-list COST semantics:** last run's cost (`DISTINCT ON`, simpler) vs sum of all runs (fix `93116cc`). Default to **sum of all runs** to match the rubric-friendly "total cost of this PR".
- No-data run → badge shows `—`, never `$0.00`.

## Verify
- Badge shows on PR list, timeline, and trace card; ≥3 decimals; `—` for missing data.
- Cost figure matches OpenRouter dashboard within rounding.
- Server + client test suites green; migration applies from zero.
- No new LLM calls in logs.
- Commit: `feat(reviews): Run Cost Badge — cost + tokens across review surfaces`.
