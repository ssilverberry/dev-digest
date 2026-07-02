import type { CSSProperties } from "react";

/** Co-located styles for FindingsPanel (extracted from inline styles). */
export const s = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  } satisfies CSSProperties,
  divider: {
    width: 1,
    height: 18,
    background: "var(--border)",
    margin: "0 2px",
  } satisfies CSSProperties,
  toggleGroup: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "var(--text-secondary)",
  } satisfies CSSProperties,
  list: { display: "flex", flexDirection: "column", gap: 12 } satisfies CSSProperties,
  /** Severity counter chip — a button wrapping <SeverityBadge>. */
  sevChip: {
    appearance: "none",
    border: "none",
    background: "transparent",
    padding: 1,
    borderRadius: 6,
    cursor: "pointer",
    lineHeight: 0,
    boxShadow: "0 0 0 0 transparent",
    transition: "opacity 120ms ease, box-shadow 120ms ease",
  } satisfies CSSProperties,
  /** Selected chip — ring around the badge. */
  sevChipActive: {
    boxShadow: "0 0 0 2px var(--border)",
  } satisfies CSSProperties,
  /** Non-selected chips are dimmed while a filter is active. */
  sevChipDim: { opacity: 0.5 } satisfies CSSProperties,
  /** Muted label shown in the toolbar when a run has no findings at all. */
  noFindings: { fontSize: 13, color: "var(--text-muted)" } satisfies CSSProperties,
} as const;
