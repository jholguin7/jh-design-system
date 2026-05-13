import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CohortRetentionChart } from "./cohort-retention-chart";

describe("CohortRetentionChart", () => {
  it("renders rows", () => {
    render(
      <CohortRetentionChart
        cohorts={[
          { label: "Jan", retention: [1.0, 0.6, 0.3] },
          { label: "Feb", retention: [1.0, 0.8, 0.5] },
        ]}
      />,
    );
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Feb")).toBeInTheDocument();
  });
});
