import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RoleBadge } from "./RoleBadge";

describe("RoleBadge", () => {
  it("renders known role label", () => {
    render(<RoleBadge role="admin" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders unknown role as-is", () => {
    render(<RoleBadge role="custom" />);
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<RoleBadge role="owner" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
