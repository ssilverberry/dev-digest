import { describe, it, expect } from "vitest";
import { formatCost } from "./cost";

describe("formatCost", () => {
  it("renders null as an em dash", () => {
    expect(formatCost(null)).toBe("—");
  });

  it("renders undefined as an em dash", () => {
    expect(formatCost(undefined)).toBe("—");
  });

  it("renders exact zero as $0.00", () => {
    expect(formatCost(0)).toBe("$0.00");
  });

  it("renders a typical run cost to 3 decimals", () => {
    expect(formatCost(0.0123)).toBe("$0.012");
  });

  it("renders a sub-$0.0005 run as $0.000 (accepted rounding)", () => {
    expect(formatCost(0.0004)).toBe("$0.000");
  });
});
