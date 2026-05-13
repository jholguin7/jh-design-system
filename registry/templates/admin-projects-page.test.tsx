import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdminProjectsPage } from "./admin-projects-page";

describe("AdminProjectsPage", () => {
  it("renders project cards", () => {
    render(
      <AdminProjectsPage
        projects={[
          { id: "p1", name: "Alpha", slug: "alpha", members: 3 },
          { id: "p2", name: "Beta", slug: "beta", members: 1 },
        ]}
      />,
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
