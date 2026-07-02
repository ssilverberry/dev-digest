# e2e flows

> Scaffold — expand as flows are added.

## Model
`run.ts` discovers every `specs/*.flow.json` and runs them in **lexical filename order** (hence
the `NN-` prefixes). Each flow is a JSON list of **agent-browser** commands driven over CDP
against the running web app. There is no test framework — a step passes iff its command exits
zero. `wait --text` / `wait --url` whose condition never holds exits non-zero and fails the flow.
Commands within a flow **share one browser session** (the daemon keeps the page between calls).

## Adding a flow
1. Create `specs/NN-<name>.flow.json` — a list of agent-browser command arg arrays.
2. Target **read-only seeded data** so no LLM call / API key is needed and runs stay deterministic.
3. Add light substring assertions with `stdoutContains` where a bare exit code isn't enough.
4. Keep steps ordered — later steps rely on the page state left by earlier ones.

## Running
Requires the web app on `E2E_BASE_URL` (default `http://localhost:3000`) and `agent-browser` on
PATH. Env knobs: `E2E_BASE_URL`, `AGENT_BROWSER_BIN`, `E2E_STEP_TIMEOUT` (ms). Results write to
`test-results/`.

## Helpers
`lib/assert.ts` — `resolveArgs`, `stdoutContains`, `summarize`, and the `Flow` / `StepResult`
types.

## See also
- current coverage + gaps → `../specs/coverage.md`
