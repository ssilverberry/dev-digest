# client — `@devdigest/web`

Next.js 15 (App Router), React 19, Tailwind 4, TanStack Query 5, next-intl, TypeScript. Dev
server on **:3000**, talks to the API on :3001. pnpm. See root `CLAUDE.md` for the stack overview.

## Session protocol (engineering-insights loop)
- **Start:** before touching this package, read `client/INSIGHTS.md` and treat it as
  high-confidence guidance. Summarize the top relevant points to confirm an active read.
- **End:** run `/engineering-insights` to capture non-obvious discoveries into
  `client/INSIGHTS.md`. Writes are **append-only** (anchored `Edit`, never `Write`); if nothing
  substantial came up, write nothing — but don't skip the check.

## Layout
- `src/app/**` — App Router routes. The PR/findings UI lives under
  `src/app/repos/[repoId]/pulls/[number]/` (+ its `_components/`).
- `src/components/**` — cross-route shared components (`app-shell`, `diff-viewer`, `page-shell`, …).
- `src/vendor/ui/**` — the design system (`@devdigest/ui`): tokens + primitives (`SeverityBadge`,
  `SEV`, …). Import styling from here; don't hand-roll it.
- `src/vendor/shared/**` — Zod contracts (duplicated with `server/`).
- `messages/en/**` — next-intl message catalogs (one JSON per feature).

## Conventions (not obvious from the code)
- **Styling = inline React style objects** in a per-component `styles.ts`
  (`const s = { … } satisfies CSSProperties`) + CSS custom-property tokens (`var(--…)`). **No**
  Tailwind classes, CSS modules, or styled-components in feature components.
- **Never mix `border`/`borderColor` shorthands with `borderLeft*` longhands** in one style
  object — React warns when one updates on rerender (see `FindingCard/styles.ts`).
- **Severity has exactly three data values** (`CRITICAL`/`WARNING`/`SUGGESTION`). `@devdigest/ui`
  also defines `INFO`, which never appears in real findings — don't render an `INFO` bucket.
  Import the data-`Severity` from `@devdigest/shared`, not the UI `Severity`, for finding data.
- **All user-facing strings go through next-intl** (`messages/en/*.json`) — a missing key renders
  the raw key. `en` is currently the only locale.
- `pnpm dev | build | test | typecheck`. Tests = Vitest + Testing Library + jsdom, co-located
  `*.test.tsx`; reuse the existing `renderWithIntl` helper.

## Do-not-touch
- `src/vendor/**` — vendored/synced (UI design system + shared contracts). Change upstream, not
  the copy in place.

## Read when…
- overall UI structure / routing / data flow → `client/docs/ui-architecture.md`
- per-page behavior + acceptance notes → `client/specs/pages.md`
- data shapes / enums → `src/vendor/shared/contracts/**`
