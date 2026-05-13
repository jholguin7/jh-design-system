import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollSpy } from "./scroll-spy";

describe("ScrollSpy", () => {
  it("renders items as links", () => {
    render(
      <ScrollSpy
        items={[
          { id: "intro", label: "Intro" },
          { id: "pricing", label: "Pricing" },
        ]}
      />,
    );
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });
});
