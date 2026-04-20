import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DependencyLink } from "./DependencyLink";

describe("DependencyLink", () => {
  it("renders the linked task title", () => {
    render(<DependencyLink relation="blocks" title="Set up CI" />);
    expect(screen.getByText("Set up CI")).toBeInTheDocument();
  });

  it("renders the optional status hint", () => {
    render(
      <DependencyLink
        relation="blocked-by"
        title="Set up CI"
        status="In progress"
      />,
    );
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it.each([
    ["blocks", "Blocks"],
    ["blocked-by", "Blocked by"],
    ["related-to", "Related to"],
    ["duplicate-of", "Duplicate of"],
  ] as const)(
    "uses the default tooltip copy for relation=%s",
    async (relation, label) => {
      const { container } = render(
        <DependencyLink relation={relation} title="X" />,
      );
      fireEvent.focus(screen.getByText("X"));
      expect(await screen.findByText(label)).toBeInTheDocument();
      expect(
        container.querySelector(`.ui-dependency-link__icon--${relation}`),
      ).not.toBeNull();
    },
  );

  it("overrides the tooltip when `tooltip` is provided", async () => {
    render(
      <DependencyLink relation="blocks" title="X" tooltip="Custom copy" />,
    );
    fireEvent.focus(screen.getByText("X"));
    expect(await screen.findByText("Custom copy")).toBeInTheDocument();
  });

  it("renders an anchor when `href` is provided", () => {
    render(
      <DependencyLink relation="blocks" title="X" href="/tasks/1" />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/tasks/1");
  });

  it("calls `onActivate` when activated via click", () => {
    const onActivate = vi.fn();
    render(
      <DependencyLink relation="blocks" title="X" onActivate={onActivate} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("calls `onActivate` on Enter key", () => {
    const onActivate = vi.fn();
    render(
      <DependencyLink relation="blocks" title="X" onActivate={onActivate} />,
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<DependencyLink ref={ref} relation="blocks" title="X" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("spreads remaining props onto root", () => {
    render(
      <DependencyLink
        data-testid="dep"
        relation="blocks"
        title="X"
      />,
    );
    expect(screen.getByTestId("dep")).toBeInTheDocument();
  });

  it("composes Icon and Text primitives", () => {
    const { container } = render(
      <DependencyLink relation="blocks" title="X" />,
    );
    expect(container.querySelector(".ui-icon")).not.toBeNull();
    expect(container.querySelector(".ui-text")).not.toBeNull();
  });

  it("passes axe in read-only form", async () => {
    const { container } = render(
      <DependencyLink relation="related-to" title="X" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe in activatable form", async () => {
    const { container } = render(
      <DependencyLink relation="blocks" title="X" href="/tasks/1" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
