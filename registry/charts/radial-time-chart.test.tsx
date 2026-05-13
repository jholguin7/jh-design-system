import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RadialTimeChart } from "./radial-time-chart";

describe("RadialTimeChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <RadialTimeChart
        slots={[
          { label: "Mon", value: 10 },
          { label: "Tue", value: 20 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
