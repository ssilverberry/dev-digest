import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { FindingRecord } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";

vi.mock("../../../../../../../lib/hooks/reviews", () => ({
  useFindingAction: () => ({ mutate: vi.fn(), isPending: false }),
}));

import { FindingsPanel } from "./FindingsPanel";

afterEach(cleanup);

const FINDINGS: FindingRecord[] = [
  {
    id: "f1",
    severity: "CRITICAL",
    category: "security",
    title: "Hardcoded secret",
    file: "src/config.ts",
    start_line: 11,
    end_line: 11,
    rationale: "A secret is committed.",
    suggestion: null,
    confidence: 0.95,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
  },
];

/** Build a finding with sane defaults; override the fields a test cares about. */
function finding(
  over: Partial<FindingRecord> & Pick<FindingRecord, "id" | "severity" | "title">,
): FindingRecord {
  return {
    category: "bug",
    file: "src/x.ts",
    start_line: 1,
    end_line: 1,
    rationale: "because",
    suggestion: null,
    confidence: 0.95,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
    ...over,
  };
}

const MIXED: FindingRecord[] = [
  finding({ id: "c1", severity: "CRITICAL", title: "Hardcoded secret" }),
  finding({ id: "c2", severity: "CRITICAL", title: "SQL injection" }),
  finding({ id: "w1", severity: "WARNING", title: "Slow query" }),
];

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("FindingsPanel (smoke)", () => {
  it("renders the toolbar + a finding card", () => {
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    expect(screen.getByText("Hide low confidence")).toBeInTheDocument();
    expect(screen.getByText("Hardcoded secret")).toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", () => {
    renderWithIntl(<FindingsPanel findings={[]} prId="pr1" />);
    expect(screen.getByText("No findings match")).toBeInTheDocument();
  });
});

describe("FindingsPanel (severity counter + filter)", () => {
  it("renders a chip per present severity with the right count, and none for absent ones", () => {
    renderWithIntl(<FindingsPanel findings={MIXED} prId="pr1" />);
    const critical = screen.getByRole("button", { name: /filter by critical/i });
    const warning = screen.getByRole("button", { name: /filter by warning/i });
    expect(within(critical).getByText("2")).toBeInTheDocument();
    expect(within(warning).getByText("1")).toBeInTheDocument();
    // SUGGESTION has no findings → no chip.
    expect(screen.queryByRole("button", { name: /filter by suggestion/i })).toBeNull();
  });

  it("filters the list to a severity on click and clears it on a second click", () => {
    renderWithIntl(<FindingsPanel findings={MIXED} prId="pr1" />);
    // all three visible up front
    expect(screen.getByText("Hardcoded secret")).toBeInTheDocument();
    expect(screen.getByText("SQL injection")).toBeInTheDocument();
    expect(screen.getByText("Slow query")).toBeInTheDocument();

    const warning = screen.getByRole("button", { name: /filter by warning/i });
    fireEvent.click(warning);
    expect(warning).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Slow query")).toBeInTheDocument();
    expect(screen.queryByText("Hardcoded secret")).toBeNull();
    expect(screen.queryByText("SQL injection")).toBeNull();

    fireEvent.click(warning);
    expect(warning).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Hardcoded secret")).toBeInTheDocument();
    expect(screen.getByText("Slow query")).toBeInTheDocument();
  });

  it("shows a 'No findings' label and no chips for an empty run", () => {
    renderWithIntl(<FindingsPanel findings={[]} prId="pr1" />);
    expect(screen.getByText("No findings")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /filter by/i })).toBeNull();
  });
});
