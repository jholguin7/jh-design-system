import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConversionSteps } from "./conversion-steps";

describe("ConversionSteps", () => {
  it("renders all step names + values", () => {
    render(
      <ConversionSteps
        steps={[
          { name: "Visit", value: 100 },
          { name: "Signup", value: 30 },
        ]}
      />,
    );
    expect(screen.getByText("Visit")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });
});
