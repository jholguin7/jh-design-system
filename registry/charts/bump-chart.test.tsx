import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BumpChart } from "./bump-chart";

describe("BumpChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <BumpChart
        periods={["Jan", "Feb", "Mar"]}
        series={[{ name: "Series", ranks: [1, 2, 1] }]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
