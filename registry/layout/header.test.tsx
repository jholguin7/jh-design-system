import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./header";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Header", () => {
  it("renders title", () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
  it("renders breadcrumb", () => {
    render(
      <Header
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Settings" },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
  it("renders rightSlot", () => {
    render(<Header title="X" rightSlot={<span data-testid="rs">user@x</span>} />);
    expect(screen.getByTestId("rs")).toBeInTheDocument();
  });
});
