import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdTimelineGantt } from "./ad-timeline-gantt";

describe("AdTimelineGantt", () => {
  it("renders bars", () => {
    render(
      <AdTimelineGantt
        bars={[
          { name: "Campaign A", start: "2026-01-01", end: "2026-02-01" },
          { name: "Campaign B", start: "2026-01-15", end: "2026-03-01" },
        ]}
      />,
    );
    expect(screen.getByText("Campaign A")).toBeInTheDocument();
    expect(screen.getByText("Campaign B")).toBeInTheDocument();
  });
});
