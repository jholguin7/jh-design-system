import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("renders label + value", () => {
    render(<KpiCard label="Total" value={1234} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
  });
  it("renders delta", () => {
    render(<KpiCard label="X" value={10} delta={{ value: 12, period: "last week" }} />);
    expect(screen.getByText(/\+12/)).toBeInTheDocument();
  });
});
