# client UI architecture

> Scaffold — expand as the UI grows.

## Shape
Next.js 15 App Router. Routes under `src/app/**`; the top-level layout is `src/app/layout.tsx`.
The core surface is the PR review view: `src/app/repos/[repoId]/pulls/[number]/` with its
route-private `_components/`. Other areas: `agents/`, `onboarding/`, `settings/`, and the repo
list at `repos/`.

- **Shared components** — `src/components/**` (`app-shell`, `page-shell`, `diff-viewer`,
  `mermaid-diagram`, …).
- **Design system** — `src/vendor/ui/**` (`@devdigest/ui`): tokens + primitives like
  `SeverityBadge` and `SEV`. Import look-and-feel from here; don't hand-roll it.

## Data
- Server data via **TanStack Query 5** hooks (e.g. `usePrReviews`); no persisted cache.
- Contracts (Zod) come from `src/vendor/shared/**`, mirrored from `server/`.
- The API is on :3001; SSE streams review progress.

## Styling
- **Inline style objects** in a per-component `styles.ts` (`satisfies CSSProperties`) + CSS
  custom-property tokens (`var(--…)`). No Tailwind classes / CSS modules / styled-components in
  feature components.
- Gotcha: never mix `border`/`borderColor` shorthands with `borderLeft*` longhands in one object
  (React rerender warning).

## i18n
next-intl; all copy in `messages/en/*.json` (one file per feature). Missing key → raw key
rendered. `en` is currently the only locale.

## Severity
Three data values (`CRITICAL`/`WARNING`/`SUGGESTION`). `@devdigest/ui` also defines `INFO` which
never appears in finding data — don't render an `INFO` bucket. Type finding data with the
`@devdigest/shared` `Severity`, not the UI one.

## See also
- per-page behavior + acceptance → `../specs/pages.md`
