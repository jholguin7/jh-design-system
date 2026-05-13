import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SunburstChart } from "./sunburst-chart";

describe("SunburstChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <SunburstChart
        root={{
          name: "root",
          children: [
            { name: "a", value: 10 },
            { name: "b", value: 20 },
          ],
        }}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
