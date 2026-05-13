import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Features } from "./features";

describe("Features", () => {
  it("renders feature cards", () => {
    render(
      <Features
        items={[
          { title: "Fast", description: "Very fast" },
          { title: "Cheap", description: "Affordable" },
        ]}
      />,
    );
    expect(screen.getByText("Fast")).toBeInTheDocument();
    expect(screen.getByText("Cheap")).toBeInTheDocument();
  });
});
