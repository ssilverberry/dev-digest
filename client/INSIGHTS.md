# INSIGHTS — client

Append-only log of non-obvious discoveries in this package, captured by the
`engineering-insights` skill. Newest entries at the bottom of each section. Keep entries
short, concrete, and file-grounded.

## What Works

## What Doesn't Work

## Codebase Patterns

- **2026-07-02** — The PR-detail "details sidebar" (Run Trace drawer) is **URL-param driven**, not local state: `page.tsx` reads `?trace=<runId>` from the search params and mounts `<RunTraceDrawer>` only when present; `onOpenTrace` just sets that param. So the drawer is deep-linkable and survives reload — open/close it by mutating the URL. Evidence: `client/src/app/repos/[repoId]/pulls/[number]/page.tsx:61,151,174`.
- **2026-07-02** — In the `RunHistory` timeline, the **whole run row** opens the trace (`row onClick → onOpenTrace`). Every inner control (agent-name → go-to-review, delete, the trace icon) must call `e.stopPropagation()` in its handler, or clicking it also opens the drawer. Commit rows are markers with no handler. Evidence: `client/src/app/repos/[repoId]/pulls/[number]/_components/RunHistory/RunHistory.tsx:154`.
- **2026-07-02** — `src/vendor/shared/contracts/**` is duplicated with `server/` with **no sync step** — a field added on one side must be hand-added to the other copy identically, or the web and API types drift. Evidence: `client/src/vendor/shared/contracts/trace.ts` + `client/tsconfig.json` paths.

## Tool & Library Notes

## Recurring Errors & Fixes

## Session Notes

### 2026-07-02
- Built the Run Cost Badge client UI: `formatCost` (`lib/cost.ts`, fixed 3-decimal), `RunCostBadge` (`compact` / `withTokens`), wired into the PR-list COST column, the timeline row, and the trace Stats card. Then made the whole timeline run row open the trace drawer per user request. Client typecheck + 35 tests green. Files: `client/src/lib/cost.ts`, `client/src/components/RunCostBadge/`, `.../pulls/{constants,styles}.ts`, `.../PRRow/PRRow.tsx`, `.../RunHistory/RunHistory.tsx`, `.../TraceBody/TraceBody.tsx`, `messages/en/{prReview,runs}.json`.

## Open Questions
