# spec — review flow

> Scaffold — the intended behavior of running a review. Ground assertions in code paths.

## Goal
Trigger a review of a PR, stream findings as they're produced, and persist them.

## Happy path
1. Client requests a review for a PR (route in `src/modules/reviews/routes.ts` /
   `src/modules/pulls/routes.ts`).
2. Server returns immediately with a run handle and executes the review **asynchronously** via
   `JobRunner` (`platform/jobs.ts`) — the request does not block on the LLM.
3. The run calls the review engine (`@devdigest/reviewer-core` → `reviewPullRequest`) with the
   diff, resolved agent inputs, and the configured `LLMProvider`.
4. Progress + findings are published on the `RunBus` (`platform/sse.ts`) and streamed to the
   client over SSE.
5. Findings (severity + category + rationale) are persisted via the reviews repository.

## Invariants
- Findings are grounded **inside** reviewer-core (`groundFindings`) before they are persisted.
- No LLM key present → the run fails fast with a clear config error (`platform/errors.ts`); the
  app still boots.
- Severity is exactly `CRITICAL` / `WARNING` / `SUGGESTION` (contract `Severity`).

## Failure paths (document)
- Provider/auth error mid-run; empty grounded result (valid, not an error); PR/diff fetch failure.

## Acceptance (fill in)
- [ ] running a review on a seeded PR yields persisted findings visible in the client
- [ ] SSE emits a terminal event that closes the stream
