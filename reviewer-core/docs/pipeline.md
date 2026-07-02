# reviewer-core pipeline

> Scaffold — expand as the engine evolves. The public surface is `src/index.ts`.

## What it is
`reviewPullRequest(input)` (`src/review/run.ts`) turns a diff + resolved agent inputs + an
injected `LLMProvider` into a **grounded** `Review`. Pure logic: no db, GitHub, or filesystem —
the LLM call is the only side effect, so the engine is mock-testable and reused by both the
server (local reviews) and the CI agent-runner.

## Stages
1. **Assemble prompt** — `assemblePrompt` builds the model input; `wrapUntrusted` fences
   attacker-controlled diff/PR text for prompt-injection hardening (`src/prompt.ts`).
2. **Map** — for large diffs, `sliceDiff` splits work; the model returns structured findings via
   the OpenAI-compatible `OpenRouterProvider` (`src/llm/openrouter.ts`) using Zod→JSON-Schema +
   parse-with-repair (`src/llm/structured.ts`).
3. **Ground** — `groundFindings` (`src/grounding.ts`) is the **mandatory** gate: every diff
   finding must cite a real quote from the diff or it's dropped. An empty result with a high
   score can be correct (LLM hallucinated all quotes) — not an error.
4. **Reduce** — `reduceReviews` merges per-slice partials into one Review (`src/review/reduce.ts`).
5. **Output** — `toReviewPayload` (`src/output/to-review.ts`) renders the grounded Review into a
   `GitHubReviewPayload` (body + inline comments + event); `gateTriggered` / `countBlockers`
   decide the review verdict.

## Invariants
- Grounding runs **inside** reviewer-core, before any finding is returned/persisted.
- No concrete provider or API key is imported here — `LLMProvider` is injected as a
  `@devdigest/shared` interface.
- The package never emits JS; `build` = `tsc --noEmit`.

## See also
- grounding rules / acceptance → `../specs/grounding-spec.md`
- how the server drives a run → `../../server/specs/review-flow.md`
