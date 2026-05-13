import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TreemapChart } from "./treemap-chart";

describe("TreemapChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <TreemapChart
        data={[
          { name: "a", size: 10 },
          { name: "b", size: 20 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
