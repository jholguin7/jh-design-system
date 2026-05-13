import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Testimonials } from "./testimonials";

describe("Testimonials", () => {
  it("renders quotes", () => {
    render(
      <Testimonials
        quotes={[
          { author: "Alice", role: "CEO", text: "Great product" },
          { author: "Bob", text: "Loved it" },
        ]}
      />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
