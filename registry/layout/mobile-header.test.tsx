import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileHeader } from "./mobile-header";

describe("MobileHeader", () => {
  it("renders title", () => {
    render(<MobileHeader title="Demo" />);
    expect(screen.getByRole("heading", { name: "Demo" })).toBeInTheDocument();
  });
  it("calls onMenuClick", async () => {
    const fn = vi.fn();
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<MobileHeader title="X" onMenuClick={fn} />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(fn).toHaveBeenCalled();
  });
});
