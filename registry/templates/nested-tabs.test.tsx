import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { NestedTabs } from "./nested-tabs";

describe("NestedTabs", () => {
  it("switches tab content on click", async () => {
    const user = userEvent.setup();
    render(
      <NestedTabs
        tabs={[
          { id: "a", label: "Alpha", content: <div>alpha-content</div> },
          { id: "b", label: "Beta", content: <div>beta-content</div> },
        ]}
      />,
    );
    expect(screen.getByText("alpha-content")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Beta" }));
    expect(screen.getByText("beta-content")).toBeInTheDocument();
  });
});
