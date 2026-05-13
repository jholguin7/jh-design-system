import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdminUsersPage } from "./admin-users-page";

describe("AdminUsersPage", () => {
  it("renders user rows", () => {
    render(
      <AdminUsersPage
        users={[
          { id: "1", email: "a@x.com", role: "admin" },
          { id: "2", email: "b@x.com", role: "user" },
        ]}
      />,
    );
    expect(screen.getByText("a@x.com")).toBeInTheDocument();
    expect(screen.getByText("b@x.com")).toBeInTheDocument();
  });
});
