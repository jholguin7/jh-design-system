import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AILoader } from "./ai-loader";

describe("AILoader", () => {
  it("renders with status role", () => {
    render(<AILoader label="Thinking" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Thinking")).toBeInTheDocument();
  });
});
