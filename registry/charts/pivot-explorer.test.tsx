import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PivotExplorer } from "./pivot-explorer";

interface SampleRow extends Record<string, string | number> {
  region: string;
  product: string;
  amount: number;
}

describe("PivotExplorer", () => {
  it("computes pivot", () => {
    const rows: SampleRow[] = [
      { region: "EC", product: "A", amount: 10 },
      { region: "EC", product: "B", amount: 5 },
      { region: "CO", product: "A", amount: 7 },
    ];
    render(
      <PivotExplorer
        rows={rows}
        rowField="region"
        colField="product"
        valueField="amount"
      />,
    );
    // Use getAllByText since "10" might appear in multiple places
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
  });
});
