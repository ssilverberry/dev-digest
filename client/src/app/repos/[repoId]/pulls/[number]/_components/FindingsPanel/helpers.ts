import type { FindingRecord, Severity } from "@devdigest/shared";
import { DATA_SEVERITIES, LOW_CONFIDENCE_THRESHOLD, SEVERITY_ORDER } from "./constants";

/** Count findings per severity (only the three data severities). */
export function severityCounts(findings: FindingRecord[]): Record<Severity, number> {
  const counts = Object.fromEntries(DATA_SEVERITIES.map((s) => [s, 0])) as Record<Severity, number>;
  for (const f of findings) {
    if (f.severity in counts) counts[f.severity] += 1;
  }
  return counts;
}

/** Optionally drop low-confidence findings, filter to one severity, and sort by severity. */
export function visibleFindings(
  findings: FindingRecord[],
  hideLow: boolean,
  sevFilter: Severity | null = null,
): FindingRecord[] {
  let shown = findings;
  if (hideLow) shown = shown.filter((f) => f.confidence >= LOW_CONFIDENCE_THRESHOLD);
  if (sevFilter) shown = shown.filter((f) => f.severity === sevFilter);
  return [...shown].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
  );
}
