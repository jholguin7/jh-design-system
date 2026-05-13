import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../providers/theme-provider";
import { ThemePicker } from "./theme-picker";

describe("ThemePicker", () => {
  it("renders combobox + toggle button", () => {
    render(
      <ThemeProvider>
        <ThemePicker />
      </ThemeProvider>,
    );
    expect(screen.getByRole("combobox", { name: /select theme/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle light\/dark/i })).toBeInTheDocument();
  });
});
