import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScatterBubbleChart } from "./scatter-bubble-chart";

describe("ScatterBubbleChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ScatterBubbleChart
        points={[
          { x: 1, y: 2 },
          { x: 3, y: 4, r: 10 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
