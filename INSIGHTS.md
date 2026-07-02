# INSIGHTS.md

Append-only log of lessons learned working in this repo. Newest entries at the
bottom of each section. Keep entries short and concrete.

## What Works
- Reusing `@devdigest/ui` primitives instead of building new UI. `SeverityBadge`
  already renders icon + label + an optional `count`, so a severity "counter chip"
  is `<SeverityBadge severity={sev} count={n} />` wrapped in a `<button>`.
- The findings list has a ready filter pattern in `FindingsPanel`: local `useState`
  + a pure `visibleFindings()` helper + a memo. New filters compose by adding a
  parameter to that helper rather than restructuring the component.
- Vitest + Testing Library co-located tests: reuse the existing `renderWithIntl`
  helper (wraps `NextIntlClientProvider` with `messages/en/prReview.json`) and the
  `FindingRecord` fixture shape from the neighbouring test file.

## What Doesn't
- (none recorded yet)

## Codebase Patterns
- Findings are grouped **per review run**: `page.tsx` → `ReviewRunAccordion` →
  `FindingsPanel` (rendered once per run). Component-local state (e.g. a severity
  filter) is therefore per-run automatically — no lifting needed. For a PR-wide
  aggregate, `page.tsx` already computes `allFindings = runs.flatMap(r => r.findings)`.
- Data contracts are Zod schemas under `src/vendor/shared/contracts`, duplicated in
  `server/` and `client/`. `Severity = ['CRITICAL','WARNING','SUGGESTION']` (three).
- Styling = inline style objects in a per-component `styles.ts` + `var(--…)` tokens.

## Tool & Library Notes
- `@devdigest/ui` tokens define a **fourth** severity `INFO` (in `SEV` + the `Severity`
  type) that never occurs in finding data. Iterate the three real values for counts;
  don't emit an `INFO` bucket. Import the data-`Severity` from `@devdigest/shared`,
  not the UI `Severity`, for anything typing finding data.
- The app boots with no LLM keys (`server/.env.example`); the default review provider
  is `openrouter`/`deepseek-v4-flash` and `OpenRouterProvider` sets the OpenAI-compatible
  base URL itself — there is no custom endpoint to configure.

## Recurring Errors & Fixes
- **React "Updating a style property during rerender (borderColor) when a conflicting
  property is set (borderLeftColor)".** Cause: a style object mixes the `borderColor`
  shorthand (which covers all four sides) with a `borderLeft*` longhand; when the
  shorthand's value changes on rerender React warns. Fix: use per-side longhands
  (`borderTopColor`/`borderRightColor`/`borderBottomColor`) alongside `borderLeftColor`.
  Fixed in `FindingCard/styles.ts` (surfaced when the severity filter re-focuses cards).

## Session Notes
- **Lesson 01 — Severity counters (feat/lesson-01).** Added per-run severity counter
  chips + click-to-filter to `FindingsPanel`, pure UI over existing `usePrReviews`
  data (no new endpoints, no new LLM calls). Reused `SeverityBadge.count`, `SEV`, and
  the existing `hideLow`/`visibleFindings` filter path; counts computed over the
  hideLow-filtered set so they match the visible list. Empty severities render no chip;
  a run with zero findings shows a "No findings" label. Tests extended in
  `FindingsPanel.test.tsx`; all client tests + typecheck green.

## Open Questions
- Is `**/vendor/**` generated from an external source we should PR into, or hand-vendored
  here? (Duplicated `contracts` across server/ and client/ suggests a sync step.)
