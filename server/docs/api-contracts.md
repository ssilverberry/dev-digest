# server API contracts

> Scaffold — expand per route as they stabilize.

## Source of truth
Request/response shapes and enums are **Zod schemas** under `src/vendor/shared/contracts/**`
(duplicated into `client/` — edit both in lock-step). The schemas are the single source of truth
for API types, LLM output, and the web/api boundary. e.g.
`Severity = ['CRITICAL','WARNING','SUGGESTION']`.

## Conventions
- Validation via Zod on the Fastify side (parse inputs, serialize typed outputs).
- Errors funnel through `platform/errors.ts`.
- Streaming endpoints use SSE over the `RunBus` (see `architecture.md`).

## Surface (fill in per module)
Routes live in `src/modules/<name>/routes.ts`:

| Module | Responsibility |
|--------|----------------|
| `repos` | repositories |
| `pulls` | pull requests + their reviews/findings |
| `reviews` | run a review, stream + persist findings |
| `repo-intel` | code indexing / context enrichment (via the `container.repoIntel` facade) |
| `polling` | background polling |
| `agents` | reviewer agent configs |
| `workspace` | workspace-level settings |
| `settings` | provider keys / app settings |

_Document each endpoint's method, path, request schema, response schema, and error cases here as
they're built. Reference the contract file for each shape (e.g. `contracts/finding.ts`)._
