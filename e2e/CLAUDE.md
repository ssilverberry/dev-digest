# e2e — `@devdigest/e2e`

Standalone agent-driven end-to-end harness. Uses **Vercel agent-browser** (a CDP
browser-automation CLI, not a test framework) to drive the running web app deterministically.
**No LLM** and no API key: flows target read-only seeded data. npm-managed. See root `CLAUDE.md`.

## Session protocol (engineering-insights loop)
- **Start:** before touching this package, read `e2e/INSIGHTS.md` and treat it as high-confidence
  guidance. Summarize the top relevant points to confirm an active read.
- **End:** run `/engineering-insights` to capture non-obvious discoveries into `e2e/INSIGHTS.md`.
  Writes are **append-only** (anchored `Edit`, never `Write`); if nothing substantial came up,
  write nothing — but don't skip the check.

## Layout
- `run.ts` — the runner: discovers `specs/*.flow.json`, runs each in lexical filename order.
- `specs/*.flow.json` — the flows. Each is a JSON list of agent-browser commands. **These are
  executable flow definitions, not prose** — a coverage/prose doc lives at `specs/coverage.md`.
- `lib/assert.ts` — `resolveArgs`, `stdoutContains`, `summarize` and the `Flow`/`StepResult` types.

## Conventions (not obvious from the code)
- **A step fails when its agent-browser command exits non-zero** — including a `wait --text` /
  `wait --url` whose condition never holds. We layer only light substring checks (`stdoutContains`)
  on top; assertions are mostly "did the command succeed."
- **Commands in a flow share one browser session** — the agent-browser daemon keeps the page
  between invocations, so later steps see the state left by earlier ones.
- **Deterministic, seed-backed:** flows exercise read-only seeded data, so nothing triggers an LLM
  call or needs a key. Keep new flows that way.
- **Env:** `E2E_BASE_URL` (default `http://localhost:3000`), `AGENT_BROWSER_BIN`
  (default `agent-browser`), `E2E_STEP_TIMEOUT` (default 60000 ms).
- Requires the web app already running on `E2E_BASE_URL` and `agent-browser` on PATH.

## Do-not-touch
- Existing `specs/*.flow.json` are the regression suite — extend/add flows rather than rewriting
  passing ones without reason.

## Read when…
- how flows are structured / how to add one → `e2e/docs/flows.md`
- what's covered vs. gaps → `e2e/specs/coverage.md`
