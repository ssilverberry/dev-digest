import type { CSSProperties } from "react";

/** Co-located styles for RunCostBadge (PR-list COST cell, timeline row, trace stats card). */
export const s = {
  compact: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" } satisfies CSSProperties,
  compactMuted: { fontSize: 13, fontWeight: 600, color: "var(--text-muted)" } satisfies CSSProperties,
  withTokens: { fontSize: 11, color: "var(--text-muted)" } satisfies CSSProperties,
} as const;
