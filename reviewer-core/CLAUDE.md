# reviewer-core — `@devdigest/reviewer-core`

The shared **review engine**: given a diff + resolved agent inputs + an LLM provider, it produces
a grounded `Review`. Pure logic — **no** database, GitHub, or filesystem access; the only side
effect is an LLM call through an **injected** `LLMProvider` (so it is fully mock-testable).
npm-managed. See root `CLAUDE.md` for the stack overview.

## Session protocol (engineering-insights loop)
- **Start:** before touching this package, read `reviewer-core/INSIGHTS.md` and treat it as
  high-confidence guidance. Summarize the top relevant points to confirm an active read.
- **End:** run `/engineering-insights` to capture non-obvious discoveries into
  `reviewer-core/INSIGHTS.md`. Writes are **append-only** (anchored `Edit`, never `Write`); if
  nothing substantial came up, write nothing — but don't skip the check.

## Layout (`src/`)
- `index.ts` — the public surface; consumers import only from here.
- `review/run.ts` — the engine entry point `reviewPullRequest` (→ grounded Review); `reduce.ts`
  — map-reduce helpers (`reduceReviews`, `sliceDiff`).
- `grounding.ts` — `groundFindings`, the **mandatory** citation-grounding gate for diff findings.
- `prompt.ts` — `assemblePrompt` + `wrapUntrusted` (prompt-injection hardening).
- `llm/` — `structured.ts` (Zod → JSON Schema + parse-with-repair) and `openrouter.ts`
  (`OpenRouterProvider`, the OpenAI-compatible structured provider shared by server + CI runner).
- `output/to-review.ts` — grounded Review → `GitHubReviewPayload`.

## Conventions (not obvious from the code)
- **Consumed as raw TypeScript**, not a built package: wired via a tsconfig path alias
  (`@devdigest/reviewer-core` → `../reviewer-core/src`) and read directly by `tsx` (dev), vitest
  (tests), and `@vercel/ncc` (the CI runner). **The package never emits JS — its `build` is a
  type-check (`tsc --noEmit`).**
- **No I/O, ever.** No db/GitHub/fs. The LLM is the single injected dependency — keep it that way
  so the engine stays mock-testable and reusable by both the server and the agent-runner.
- **Grounding is a hard gate.** Diff findings pass through `groundFindings` before they count —
  an empty result with a high score can be correct (e.g. the LLM hallucinated all quotes), not an
  error.
- `LLMProvider` is an interface from `@devdigest/shared`; never import a concrete provider or an
  API key into this package.

## Do-not-touch
- The public exports in `src/index.ts` are a contract for `server/` and `e2e/`/runner consumers —
  changing a signature ripples across packages; coordinate before altering it.

## Read when…
- the map → ground → reduce → payload pipeline → `reviewer-core/docs/pipeline.md`
- grounding rules / acceptance → `reviewer-core/specs/grounding-spec.md`
