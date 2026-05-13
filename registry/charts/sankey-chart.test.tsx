import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SankeyChart } from "./sankey-chart";

describe("SankeyChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <SankeyChart
        nodes={[{ name: "A" }, { name: "B" }, { name: "C" }]}
        links={[
          { source: 0, target: 1, value: 10 },
          { source: 1, target: 2, value: 5 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
