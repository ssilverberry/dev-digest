/* RunCostBadge — renders a run's/PR's USD cost, shared by the PR-list COST
   column, the Agent-runs timeline row, and the Run Trace stats card. */
import React from "react";
import { formatCost } from "@/lib/cost";
import { s } from "./styles";

type RunCostBadgeProps =
  | {
      /** PR-list COST cell: just the total cost, muted when there's nothing priced yet. */
      variant: "compact";
      cost: number | null | undefined;
    }
  | {
      /** Timeline row: token count + cost, e.g. "1.2k tok · $0.012". */
      variant: "withTokens";
      tokensIn: number | null | undefined;
      tokensOut: number | null | undefined;
      cost: number | null | undefined;
    };

export function RunCostBadge(props: RunCostBadgeProps) {
  if (props.variant === "compact") {
    const muted = props.cost == null;
    return (
      <span className="tnum" style={muted ? s.compactMuted : s.compact}>
        {formatCost(props.cost)}
      </span>
    );
  }

  const { tokensIn, tokensOut, cost } = props;
  const total = (tokensIn ?? 0) + (tokensOut ?? 0);
  if (total === 0 && cost == null) {
    return <span style={s.withTokens}>—</span>;
  }
  return (
    <span className="tnum" style={s.withTokens}>
      {total.toLocaleString()} tok · {formatCost(cost)}
    </span>
  );
}
