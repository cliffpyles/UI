import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VisibilityBadge } from "./VisibilityBadge";

describe("VisibilityBadge", () => {
  it("renders label for each visibility", () => {
    const { rerender } = render(<VisibilityBadge visibility="private" />);
    expect(screen.getByText("Private")).toBeInTheDocument();
    rerender(<VisibilityBadge visibility="public" />);
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("hides label with showLabel=false", () => {
    render(<VisibilityBadge visibility="team" showLabel={false} />);
    expect(screen.getByRole("img", { name: "Team" })).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<VisibilityBadge visibility="private" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
