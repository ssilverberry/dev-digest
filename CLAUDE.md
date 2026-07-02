# CLAUDE.md — dev-digest

Project constitution for AI agents. Keep it short; link out for detail.

## What this is
An AI code-review app: it fetches GitHub PRs, runs LLM "reviewer" agents over the
diff, and shows structured **findings** (severity + category + rationale) in a web UI.

## Stack
- **server/** `@devdigest/api` — Fastify 5, Drizzle ORM + Postgres (pgvector), Zod,
  TypeScript 5.7 (ESM), run with `tsx`. Serves the REST/SSE API on **:3001**.
- **client/** `@devdigest/web` — Next.js 15 (App Router), React 19, Tailwind 4,
  TanStack Query 5, next-intl, TypeScript 5.7. Dev server on **:3000**.
- **reviewer-core/** — the shared review engine + LLM providers (OpenAI, Anthropic,
  OpenRouter). npm-managed; imported by the API via a tsconfig path alias.
- **e2e/** — standalone agent-driven end-to-end harness (npm).
- Postgres runs in Docker (`pgvector/pgvector:pg16`) via `docker-compose.yml`.

Each package installs independently — **there is no root pnpm workspace.**
`server/` and `client/` use pnpm; `reviewer-core/` and `e2e/` use npm.

## Run / build / test
- **Boot everything:** `./scripts/dev.sh` (Docker → migrate → seed → API + web).
  Variants: `--no-client` (API + DB only), `--db-only`, `--no-seed`. Needs Docker + pnpm.
- **Server:** `cd server && pnpm dev | pnpm test | pnpm typecheck`; DB:
  `pnpm db:migrate`, `pnpm db:seed`, `pnpm db:generate` (drizzle-kit).
- **Client:** `cd client && pnpm dev | pnpm build | pnpm test | pnpm typecheck`.
- **Tests:** Vitest everywhere. Client = Testing Library + jsdom (co-located
  `*.test.tsx`). Server = Vitest + testcontainers.

## Map
- `server/src/modules/**` — feature modules (pulls, reviews, settings, …).
- `server/src/db/schema/**` — Drizzle tables; `db/seed.ts` = demo data.
- `server/src/platform/**` — config, DI container, LLM provider wiring.
- `client/src/app/**` — Next.js App Router routes. The PR/findings UI lives under
  `client/src/app/repos/[repoId]/pulls/[number]/` (+ its `_components/`).
- `client/src/vendor/ui/**` — design system (`@devdigest/ui`): tokens, primitives
  (`SeverityBadge`, `SEV`, …). Import styling from here, don't hand-roll it.
- `*/src/vendor/shared/contracts/**` — Zod schemas = the single source of truth for
  API + LLM output + web/api types. e.g. `Severity = ['CRITICAL','WARNING','SUGGESTION']`.

## Do-not-touch
- `server/clones/**` — cloned-repo **fixtures** (incl. a nested `CLAUDE.md`). Not app code.
- `**/vendor/**` — vendored/synced copies (the `contracts` dir is duplicated across
  `server/` and `client/`). Avoid editing in place; change the upstream source.
- Generated Drizzle migration SQL under `server/src/db/migrations/**`.

## Conventions
- Styling: inline React style objects co-located in a `styles.ts` per component
  (`const s = { … } satisfies CSSProperties`) + CSS custom-property tokens (`var(--…)`).
  No Tailwind classes, CSS modules, or styled-components in feature components.
- Never mix the `border`/`borderColor` shorthands with `borderLeft*` longhands in the
  same style object — React warns when one updates on rerender (see `FindingCard/styles.ts`).
- User-facing strings: next-intl; messages in `client/messages/en/*.json`.
- Severity has exactly three values in data; `@devdigest/ui` also defines `INFO`, which
  never appears in real findings — don't render an `INFO` bucket over finding data.

## LLM keys
The app boots with **no** keys. A provider key is only needed to *run* a review or
enable embeddings. Set `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY`
(+ `GITHUB_TOKEN`) in `server/.env`, or via the Settings UI. Default review provider is
`openrouter`. See `server/.env.example`.

## Read when…
- setting up or unsure how the stack boots → `scripts/dev.sh`, `README.md`, `server/.env.example`
- testing → `TESTING.md`
- data shapes / enums / API contracts → `*/src/vendor/shared/contracts/**`
- lessons learned this project → `INSIGHTS.md`
- feature specs → `specs/**`
