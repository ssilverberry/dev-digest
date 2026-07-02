/**
 * USD cost formatter shared by the PR-list COST column, the Agent-runs
 * timeline, and the Run Trace stats card. Fixed 3-decimal formatting so
 * sub-cent run costs (the common case) still read as non-zero.
 */

/** `null/undefined` → "—"; exact `0` → "$0.00"; else `$0.012` (fixed 3dp). */
export function formatCost(usd: number | null | undefined): string {
  if (usd == null) return "—";
  if (usd === 0) return "$0.00";
  return `$${usd.toFixed(3)}`;
}
