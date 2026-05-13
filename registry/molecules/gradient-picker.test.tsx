import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GradientPicker } from "./gradient-picker";

describe("GradientPicker", () => {
  it("renders preset buttons", () => {
    render(
      <GradientPicker
        presets={[
          { id: "a", name: "Alpha", stops: ["#fff", "#000"] },
          { id: "b", name: "Beta", stops: ["#f00", "#0f0"] },
        ]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
