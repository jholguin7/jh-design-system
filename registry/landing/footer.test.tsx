import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders links + legal", () => {
    render(
      <Footer
        links={[{ label: "About", href: "/about" }]}
        legal="© 2026"
      />,
    );
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("© 2026")).toBeInTheDocument();
  });
});
