import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SocialProof } from "./social-proof";

describe("SocialProof", () => {
  it("renders logos", () => {
    render(
      <SocialProof
        heading="Trusted by"
        logos={[
          { name: "Acme", src: "/acme.svg" },
          { name: "Globex", src: "/globex.svg" },
        ]}
      />,
    );
    expect(screen.getByText("Trusted by")).toBeInTheDocument();
    expect(screen.getByAltText("Acme")).toBeInTheDocument();
  });
});
