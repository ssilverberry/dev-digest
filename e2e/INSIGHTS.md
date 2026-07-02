# INSIGHTS — e2e

Append-only log of non-obvious discoveries in this package, captured by the
`engineering-insights` skill. Newest entries at the bottom of each section. Keep entries
short, concrete, and file-grounded.

## What Works

## What Doesn't Work

## Codebase Patterns

- **2026-07-02** — e2e specs are **executable** `specs/*.flow.json` files (lists of agent-browser CDP commands), not prose; `run.ts` discovers and runs them in **lexical filename order** (hence the `NN-` prefixes). Evidence: `e2e/run.ts:35`.

## Tool & Library Notes

- **2026-07-02** — A flow step fails iff its agent-browser command exits non-zero — including a `wait --text` / `wait --url` whose condition never holds; commands within a flow **share one browser session** (the daemon keeps the page between calls). Deterministic + seed-backed → no LLM/key. Env: `E2E_BASE_URL` / `AGENT_BROWSER_BIN` / `E2E_STEP_TIMEOUT`. Evidence: `e2e/run.ts:5`.

## Recurring Errors & Fixes

## Session Notes

### 2026-07-02
- Scaffolded e2e docs while building the `engineering-insights` skill; documented the agent-browser flow model and current coverage. Files: `e2e/CLAUDE.md`, `e2e/docs/flows.md`, `e2e/specs/coverage.md`.

## Open Questions
