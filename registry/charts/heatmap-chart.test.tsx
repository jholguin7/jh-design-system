import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeatmapChart } from "./heatmap-chart";

describe("HeatmapChart", () => {
  it("renders cells", () => {
    render(
      <HeatmapChart
        cells={[
          { x: "Mon", y: "AM", value: 5 },
          { x: "Mon", y: "PM", value: 3 },
        ]}
      />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
