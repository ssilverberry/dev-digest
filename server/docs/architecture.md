# server architecture

> Scaffold — expand as the design settles. Ground every claim in a file path.

## Shape
Fastify 5 app (`src/app.ts` → `src/server.ts`) serving REST + SSE on **:3001**. Feature logic is
split into modules; cross-cutting wiring lives in `platform/`.

- **Modules** (`src/modules/**`) — each a Fastify plugin at `modules/<name>/routes.ts`,
  registered statically in `src/modules/index.ts` (no filesystem autoload — same path under
  `tsx`, bundler, and vitest).
- **Platform** (`src/platform/**`) — `container.ts` (DI), `config.ts`, `sse.ts` (RunBus),
  `errors.ts`, `grounding.ts`, `price-book.ts`, `model-router.ts`, `jobs.ts`, `trace-builder.ts`.
- **Adapters** (`src/adapters/**`) — concrete impls of the `@devdigest/shared` ports.

## Dependency injection (`platform/container.ts`)
One container per app instance: holds config, db, the `JobRunner`, the SSE `RunBus`, and
lazily-constructed adapters. Services depend on **interfaces** from `@devdigest/shared`
(`SecretsProvider`, `GitHubClient`, `GitClient`, `CodeIndex`, `Embedder`, `LLMProvider`,
`AuthProvider`, …), never on concrete classes. Tests inject mocks via `ContainerOverrides`.

Adapters are resolved lazily through `SecretsProvider`, so the app **boots with no LLM keys** —
a key is only needed to actually run a review or enable embeddings.

## Async reviews + SSE
Long-running reviews run off the request via `JobRunner`; progress/events are published on the
in-memory `RunBus` (`platform/sse.ts`) and streamed to clients over SSE.

## Data
Drizzle ORM + Postgres (pgvector). Tables in `src/db/schema/**`; demo data in `src/db/seed.ts`.
Migrations are **explicit**: `db/schema/*.ts` → `pnpm db:generate` (drizzle-kit emits
`db/migrations/NNNN_*.sql`) → `pnpm db:migrate`. Never hand-edit generated SQL.

## See also
- API request/response shapes → `api-contracts.md`
- the review lifecycle end-to-end → `../specs/review-flow.md`
- the review engine itself → `../../reviewer-core/docs/pipeline.md`
