import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RadarChart } from "./radar-chart";

describe("RadarChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <RadarChart
        axes={["A", "B", "C"]}
        series={[{ name: "Series", values: [1, 2, 3] }]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
