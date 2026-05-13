import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GradientPicker } from "./gradient-picker";

describe("GradientPicker", () => {
  beforeEach(() => {
    try { window.localStorage.clear(); } catch { /* ignore */ }
  });

  it("renders trigger with current gradient name", () => {
    render(
      <GradientPicker
        value={{ id: "ant" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Ant")).toBeInTheDocument();
  });

  it("opens preset popup on trigger click", async () => {
    render(
      <GradientPicker
        value={{ id: "ant" }}
        onChange={vi.fn()}
      />,
    );
    const trigger = screen.getAllByRole("button")[0];
    await userEvent.click(trigger);
    expect(screen.getByText("Presets")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("emits onChange when a preset is clicked", async () => {
    const onChange = vi.fn();
    render(
      <GradientPicker
        value={{ id: "ant" }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getAllByRole("button")[0]);
    await userEvent.click(screen.getByText("Mint"));
    expect(onChange).toHaveBeenCalledWith({ id: "mint" });
  });

  it("respects custom labels", () => {
    render(
      <GradientPicker
        value={{ id: "ant" }}
        onChange={vi.fn()}
        labels={{ flipGradient: "Voltear" }}
      />,
    );
    expect(screen.getByTitle("Voltear")).toBeInTheDocument();
  });
});
