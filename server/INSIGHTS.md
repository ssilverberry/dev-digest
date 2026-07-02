# INSIGHTS — server

Append-only log of non-obvious discoveries in this package, captured by the
`engineering-insights` skill. Newest entries at the bottom of each section. Keep entries
short, concrete, and file-grounded.

## What Works

## What Doesn't Work

## Codebase Patterns

- **2026-07-02** — Feature modules are registered **statically** in `server/src/modules/index.ts` (one import + one entry each), not via filesystem autoload — deliberately, so the same path works under `tsx`, the bundler, and vitest (native dynamic `import()` of `.ts` isn't portable). Evidence: `server/src/modules/index.ts:24`.
- **2026-07-02** — DI (`platform/container.ts`): services depend on the `@devdigest/shared` **interfaces**, never on concrete adapter classes; adapters resolve lazily through `SecretsProvider`, so the app boots with **no** LLM keys, and tests inject mocks via `ContainerOverrides`. Evidence: `server/src/platform/container.ts:33`.
- **2026-07-02** — Per-parent rollups are computed in **JS, never SQL** — there is no `DISTINCT ON` / `sum()` / `groupBy()` anywhere in `server/src`. `GET /pulls` fetches child rows with `inArray(prIds)` and folds them into a `Map` (latest review score, and total run cost). Mirror this pattern for any new per-PR aggregate rather than reaching for a SQL aggregate. Evidence: `server/src/modules/pulls/routes.ts:114-186`.
- **2026-07-02** — `src/vendor/shared/contracts/**` is **hand-vendored and duplicated** with `client/`; there is **no sync script or generator** (each package resolves `@devdigest/shared` via its own tsconfig `paths`). Every contract change must edit BOTH the `server/` and `client/` copies identically or the two packages' types silently drift. Evidence: `server/src/vendor/shared/contracts/trace.ts` + `server/tsconfig.json` paths.
- **2026-07-02** — Adding one field to an agent run is a fixed lockstep chain: `db/schema/runs.ts` (column, then `pnpm db:generate`) → `run-executor.ts` (destructure from `outcome` **and** every `completeAgentRun`/trace-`stats` site, incl. the two failure paths and the synthetic `traceFromBuffer` which pass a null/zero) → `run.repo.ts` (`completeAgentRun` values type + `.set` + `listRunsForPull` mapper) → `repository.ts` wrapper signature → both contract copies. Miss one site and typecheck/tests fail. Evidence: `server/src/modules/reviews/run-executor.ts:214`.

## Tool & Library Notes

- **2026-07-02** — Run cost is computed by the **engine**, not the server: `reviewer-core` sets `outcome.costUsd` from OpenRouter's real `usage.cost` (opted in with `usage:{include:true}` in the request body), falling back to `PriceBook.estimate` (live `/models` prices, then the static table in `adapters/llm/pricing.ts`, else null). The `agent_runs.cost_usd` column is pure persistence — there is **no backfill**, so historical rows stay null and the seed inserts **zero** `agent_runs`; cost only appears after a fresh live review. Evidence: `reviewer-core/src/llm/openrouter.ts:81,107`, `server/src/platform/price-book.ts:34`, `server/src/db/seed.ts`.

## Recurring Errors & Fixes

## Session Notes

### 2026-07-02
- Scaffolded per-package agent guides + the `engineering-insights` skill (no app code touched). Verified server conventions above by reading the module registry and DI container. Files: `server/CLAUDE.md`, `server/docs/architecture.md`, `server/docs/api-contracts.md`, `server/specs/review-flow.md`.
- Re-plumbed the Run Cost Badge: re-added `agent_runs.cost_usd` (migration `0010`) and threaded `outcome.costUsd` → executor → repo → routes → contracts; PR-list COST = null-tolerant JS `SUM` of runs (`total_cost_usd`). Zero reviewer-core changes. Server typecheck + 129 tests green. Files: `server/src/db/schema/runs.ts`, `.../reviews/run-executor.ts`, `.../reviews/repository/run.repo.ts`, `.../pulls/routes.ts`, `src/vendor/shared/contracts/{trace,platform}.ts`.

## Open Questions
