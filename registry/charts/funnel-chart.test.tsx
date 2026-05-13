import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FunnelChart } from "./funnel-chart";

describe("FunnelChart", () => {
  it("renders without crashing with sample data", () => {
    const { container } = render(
      <FunnelChart
        stages={[
          { name: "Visit", value: 100 },
          { name: "Signup", value: 40 },
          { name: "Paid", value: 10 },
        ]}
      />,
    );
    expect(container.querySelector("svg, div")).toBeTruthy();
  });
});
