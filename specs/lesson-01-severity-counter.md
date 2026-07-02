# Spec — Severity counters + click-to-filter (Lesson 01)

Branch: `feat/lesson-01` · Status: implemented

## Problem
The PR findings list shows every finding but gives no at-a-glance sense of how many
issues there are per severity, and no quick way to focus on one severity. Add a
counter (e.g. `Critical 3 · Warning 5 · Suggestion 2`) where clicking a level filters
the list to that severity. Must be **pure UI over data already in memory** — no new
backend endpoints and **no new LLM calls**.

## Decisions
- **Placement — per review run.** Chips live in each `FindingsPanel` toolbar; the
  filter is component-local, so it's independent per run on the same PR.
- **Counts match the visible list.** Counts are computed over the `hideLow`-filtered
  set (reusing `LOW_CONFIDENCE_THRESHOLD`), so the numbers agree with what's shown.
- **Hide empty severities.** A severity with zero findings shows no chip (no fake `0`s).
  The active filter's chip stays visible even if its count drops to 0, so it can be
  cleared. A run with zero findings total shows a muted "No findings" label instead.
- **Three data severities only.** `CRITICAL | WARNING | SUGGESTION`. The `INFO` token
  in `@devdigest/ui` never appears in finding data and is not rendered.

## Implementation
All under `client/src/app/repos/[repoId]/pulls/[number]/_components/`:
- `FindingsPanel/constants.ts` — `DATA_SEVERITIES` (the three data severities, ordered).
- `FindingsPanel/helpers.ts` — `severityCounts()`; `visibleFindings()` gains an optional
  `sevFilter` param (filters after `hideLow`, before the existing severity sort).
- `FindingsPanel/FindingsPanel.tsx` — `sevFilter` state; a `counts` memo; renders a
  `<button>`-wrapped `SeverityBadge` per present severity (toggles the filter; dims
  non-active chips; `aria-pressed` + `aria-label`); "No findings" label for empty runs.
- `FindingsPanel/styles.ts` — chip / active-ring / dim / label styles.
- `client/messages/en/prReview.json` — `panel.noFindings`, `panel.filterBySeverity`.
- `FindingCard/styles.ts` — drive-by: split the `borderColor` shorthand into per-side
  longhands so re-focusing a card no longer triggers a React shorthand/longhand warning.

Reused (not rebuilt): `SeverityBadge` (`count` prop) + `SEV` from `@devdigest/ui`; the
existing `hideLow` / `visibleFindings` filter path.

## Acceptance criteria
- Counter shows correct per-severity counts; counts match the findings list.
- Clicking a level filters the list to that severity; clicking again clears it.
- Empty severities show no chip; an empty run shows "No findings".
- **No new LLM calls** while interacting (verified in Network tab + API log).
- Unit tests in `FindingsPanel.test.tsx` cover counts, filter toggle, and the empty run;
  full client `pnpm test` + `pnpm typecheck` pass.
