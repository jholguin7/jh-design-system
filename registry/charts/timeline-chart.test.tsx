import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimelineChart } from "./timeline-chart";

describe("TimelineChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <TimelineChart
        events={[
          { date: "2025-01-01", value: 10 },
          { date: "2025-02-01", value: 15 },
        ]}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
