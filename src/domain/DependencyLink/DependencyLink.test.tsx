import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DependencyLink } from "./DependencyLink";

describe("DependencyLink", () => {
  it("renders from/to/type", () => {
    render(<DependencyLink from="T1" to="T2" type="blocks" />);
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("blocks")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<DependencyLink from="A" to="B" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
