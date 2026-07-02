# INSIGHTS — reviewer-core

Append-only log of non-obvious discoveries in this package, captured by the
`engineering-insights` skill. Newest entries at the bottom of each section. Keep entries
short, concrete, and file-grounded.

## What Works

## What Doesn't Work

## Codebase Patterns

- **2026-07-02** — `@devdigest/reviewer-core` is consumed as **raw TypeScript** via a tsconfig path alias (`→ ../reviewer-core/src`) by `tsx`, vitest, and the ncc runner — it **never emits JS**; its `build` is a type-check (`tsc --noEmit`). Don't add a `dist/` or import a built artifact. Evidence: `reviewer-core/src/index.ts:9`.
- **2026-07-02** — Citation grounding (`groundFindings`) is the **mandatory** gate run inside the engine before findings are returned; an empty grounded result with a high score is a **valid** outcome (model hallucinated all quotes), not an error to guard against. Evidence: `reviewer-core/src/index.ts:22`.

## Tool & Library Notes

## Recurring Errors & Fixes

## Session Notes

### 2026-07-02
- Scaffolded reviewer-core docs while building the `engineering-insights` skill; documented the assemble → map → ground → reduce → output pipeline and the grounding contract. Files: `reviewer-core/CLAUDE.md`, `reviewer-core/docs/pipeline.md`, `reviewer-core/specs/grounding-spec.md`.

## Open Questions
