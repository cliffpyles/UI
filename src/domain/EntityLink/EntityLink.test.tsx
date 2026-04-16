import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { EntityLink } from "./EntityLink";

describe("EntityLink", () => {
  it("renders label", () => {
    render(<EntityLink entity={{ type: "user", id: 1, label: "Jane" }} href="/u/1" />);
    expect(screen.getByRole("link", { name: /Jane/ })).toBeInTheDocument();
  });

  it("adds rel for external links", () => {
    render(
      <EntityLink
        entity={{ type: "task", id: 1, label: "T1" }}
        href="https://x"
        external
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <EntityLink
        ref={ref}
        entity={{ type: "task", id: 1, label: "T1" }}
        href="#"
        className="x"
        data-testid="l"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(screen.getByTestId("l")).toHaveClass("ui-entity-link", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <EntityLink entity={{ type: "user", id: 1, label: "Jane" }} href="#" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
