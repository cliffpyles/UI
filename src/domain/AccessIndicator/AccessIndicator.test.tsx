import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AccessIndicator } from "./AccessIndicator";

describe("AccessIndicator", () => {
  it("shows allowed state", () => {
    render(<AccessIndicator hasAccess />);
    expect(screen.getByRole("img", { name: "Access granted" })).toBeInTheDocument();
  });

  it("shows restricted state", () => {
    render(<AccessIndicator hasAccess={false} />);
    expect(screen.getByRole("img", { name: "Access restricted" })).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<AccessIndicator hasAccess />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
