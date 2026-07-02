# spec — citation grounding

> Scaffold — the contract for `groundFindings` (`src/grounding.ts`). Expand with cases.

## Why
The model can hallucinate quotes/locations. Grounding is the **mandatory mechanical gate**: a
diff finding only counts if it cites text that actually appears in the diff. This runs inside
reviewer-core before any finding is returned or persisted.

## Rules
- Each finding carries a quote/anchor; grounding verifies it against the supplied diff.
- Ungrounded findings are dropped (not surfaced to the user).
- `groundingSummary` reports how many findings passed vs. were dropped and a score.
- An **empty grounded result with a high score is valid** — it means the model hallucinated all
  quotes; that is a correct outcome, not an error.

## Interfaces
`groundFindings(...) -> GroundingResult`, `groundingSummary(...)` — see `src/grounding.ts` and the
`ReviewOutcome` shape in `src/review/run.ts`.

## Acceptance (fill in)
- [ ] a finding quoting real diff text passes
- [ ] a finding quoting text not in the diff is dropped
- [ ] all-hallucinated findings → empty result, no throw
