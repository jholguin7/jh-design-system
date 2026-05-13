import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FunnelWaterfallChart } from "./funnel-waterfall-chart";

describe("FunnelWaterfallChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <FunnelWaterfallChart
        stages={[
          { name: "A", value: 100 },
          { name: "B", value: 60 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
