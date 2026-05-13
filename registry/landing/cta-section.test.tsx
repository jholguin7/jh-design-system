import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CtaSection } from "./cta-section";

describe("CtaSection", () => {
  it("renders title and CTA", () => {
    render(<CtaSection title="Sign up" ctaLabel="Get started" />);
    expect(screen.getByRole("heading", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });
});
