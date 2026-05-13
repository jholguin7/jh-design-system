import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Hero } from "./hero";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Hero", () => {
  it("renders title + subtitle", () => {
    render(<Hero title="Welcome" subtitle="Subtitle here" />);
    expect(screen.getByRole("heading", { name: "Welcome" })).toBeInTheDocument();
    expect(screen.getByText("Subtitle here")).toBeInTheDocument();
  });
});
