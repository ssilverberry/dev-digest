/**
 * RunHistory — the badge must reflect the review OUTCOME, not the run lifecycle.
 * Regression guard for the "green ✓ done on a run that found 5 blockers" bug:
 * a settled run is colored/labelled by its denormalized blocker/finding counts,
 * and shows the review score ring.
 */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { RunSummary } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";
import { RunHistory } from "./RunHistory";

afterEach(cleanup);

function run(o: Partial<RunSummary>): RunSummary {
  return {
    run_id: "run-1",
    agent_id: "a1",
    agent_name: "Security Reviewer",
    provider: "openrouter",
    model: "deepseek/deepseek-v4-flash",
    status: "done",
    error: null,
    duration_ms: 1000,
    tokens_in: 100,
    tokens_out: 50,
    cost_usd: null,
    findings_count: 0,
    grounding: "0/0 passed",
    ran_at: "2026-06-11T18:44:34.000Z",
    score: null,
    blockers: null,
    ...o,
  };
}

function renderRuns(runs: RunSummary[]) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      <RunHistory runs={runs} onOpenTrace={() => {}} />
    </NextIntlClientProvider>,
  );
}

describe("RunHistory — outcome badge", () => {
  it("a done run WITH blockers reads 'rejected' (never green 'done') + shows the score ring", () => {
    renderRuns([run({ status: "done", findings_count: 5, blockers: 5, score: 0 })]);
    expect(screen.getByText("rejected")).toBeInTheDocument();
    expect(screen.queryByText("done")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument(); // CircularScore renders the number
    expect(screen.getByText(/5 blockers/)).toBeInTheDocument();
  });

  it("a clean done run reads 'approved'", () => {
    renderRuns([run({ status: "done", findings_count: 0, blockers: 0, score: 95 })]);
    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByText("95")).toBeInTheDocument();
  });

  it("a done run with non-blocking findings reads 'reviewed'", () => {
    renderRuns([run({ status: "done", findings_count: 3, blockers: 0, score: 72 })]);
    expect(screen.getByText("reviewed")).toBeInTheDocument();
    expect(screen.queryByText(/blockers/)).not.toBeInTheDocument();
  });

  it("a failed run reads 'error'", () => {
    renderRuns([run({ status: "failed", error: "boom", score: null, blockers: null })]);
    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("a running run reads 'running'", () => {
    renderRuns([run({ status: "running", score: null, blockers: null })]);
    expect(screen.getByText("running")).toBeInTheDocument();
  });
});

describe("RunHistory — cost badge", () => {
  it("a settled run with tokens + cost shows 'N tok · $cost'", () => {
    renderRuns([run({ status: "done", tokens_in: 100, tokens_out: 50, cost_usd: 0.012 })]);
    expect(screen.getByText("150 tok · $0.012")).toBeInTheDocument();
  });

  it("a settled run with no tokens and no cost shows an em dash", () => {
    renderRuns([run({ status: "done", tokens_in: 0, tokens_out: 0, cost_usd: null })]);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("a running run shows no cost badge", () => {
    renderRuns([run({ status: "running", tokens_in: 0, tokens_out: 0, cost_usd: null, score: null, blockers: null })]);
    expect(screen.queryByText("—")).not.toBeInTheDocument();
    expect(screen.queryByText(/tok ·/)).not.toBeInTheDocument();
  });
});

describe("RunHistory — row opens trace", () => {
  it("clicking anywhere on a run row opens its trace", () => {
    const onOpenTrace = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
        <RunHistory runs={[run({ run_id: "run-42" })]} onOpenTrace={onOpenTrace} />
      </NextIntlClientProvider>,
    );
    // Click a neutral part of the row (the provider/model label), not a control.
    fireEvent.click(screen.getByText("openrouter/deepseek/deepseek-v4-flash"));
    expect(onOpenTrace).toHaveBeenCalledWith("run-42");
  });

  it("clicking the agent name goes to the review, not the trace (stopPropagation)", () => {
    const onOpenTrace = vi.fn();
    const onGoToReview = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
        <RunHistory runs={[run({ run_id: "run-7" })]} onOpenTrace={onOpenTrace} onGoToReview={onGoToReview} />
      </NextIntlClientProvider>,
    );
    fireEvent.click(screen.getByText("Security Reviewer"));
    expect(onGoToReview).toHaveBeenCalledWith("run-7");
    expect(onOpenTrace).not.toHaveBeenCalled();
  });

  it("clicking delete removes the run without opening the trace (stopPropagation)", () => {
    const onOpenTrace = vi.fn();
    const onDelete = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
        <RunHistory runs={[run({ run_id: "run-9" })]} onOpenTrace={onOpenTrace} onDelete={onDelete} />
      </NextIntlClientProvider>,
    );
    fireEvent.click(screen.getByLabelText(messages.timeline.deleteRun));
    expect(onDelete).toHaveBeenCalledWith("run-9");
    expect(onOpenTrace).not.toHaveBeenCalled();
  });
});
