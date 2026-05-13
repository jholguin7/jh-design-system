import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("renders links", () => {
    render(
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });
});
