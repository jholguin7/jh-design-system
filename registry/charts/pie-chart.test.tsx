import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PieChart } from "./pie-chart";

describe("PieChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <PieChart
        slices={[
          { name: "A", value: 30 },
          { name: "B", value: 70 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
