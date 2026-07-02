# spec — pages

> Scaffold — intended behavior per route. Expand with acceptance checks.

## Routes (`src/app/**`)
| Route | Purpose |
|-------|---------|
| `/` (`page.tsx`) | landing / entry |
| `repos/` | repository list |
| `repos/[repoId]/pulls/[number]/` | **core view** — PR + review runs + findings |
| `agents/` | reviewer agent configuration |
| `onboarding/` | first-run setup |
| `settings/` | provider keys / app settings |

## PR / findings view (primary)
- Findings are grouped **per review run**; a run renders its own findings panel.
- Severity chips/counters iterate the three real severities (`CRITICAL`/`WARNING`/`SUGGESTION`)
  — never an `INFO` bucket. Empty severities render no chip.
- Filtering (e.g. by severity, hide-low) is component-local state over the already-fetched
  findings — no refetch.

## Cross-cutting
- All copy from `messages/en/*.json`; a missing key renders the raw key.
- Styling via per-component `styles.ts` + tokens; primitives from `@devdigest/ui`.

## Acceptance (fill in)
- [ ] PR view lists runs and their findings from seeded data
- [ ] severity counters match the visible (filtered) finding set
- [ ] a run with zero findings shows a "No findings" state
