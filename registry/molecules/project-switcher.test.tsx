import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProjectSwitcher } from "./project-switcher";

describe("ProjectSwitcher", () => {
  it("renders current project name", () => {
    render(
      <ProjectSwitcher
        projects={[
          { id: "a", name: "Alpha" },
          { id: "b", name: "Beta" },
        ]}
        currentId="a"
        onSwitch={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Alpha");
  });
});
