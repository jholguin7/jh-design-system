import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterBar } from "./filter-bar";

describe("FilterBar", () => {
  it("renders all filter widgets", () => {
    render(
      <FilterBar
        filters={[
          { id: "name", type: "text", label: "Name" },
          {
            id: "status",
            type: "select",
            label: "Status",
            options: [{ value: "active", label: "Active" }],
          },
        ]}
        state={{}}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /status/i })).toBeInTheDocument();
  });
});
