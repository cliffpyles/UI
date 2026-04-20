import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EntityLink } from "./EntityLink";

describe("EntityLink", () => {
  it("renders an <a href> with type icon and label", () => {
    const { container } = render(
      <EntityLink
        type="issue"
        identifier="#1234"
        label="Fix login"
        href="/issues/1234"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/issues/1234");
    expect(link.textContent).toContain("#1234");
    expect(link.textContent).toContain("Fix login");
    expect(container.querySelector(".ui-icon")).not.toBeNull();
  });

  it("exposes full text via title and aria-label", () => {
    render(
      <EntityLink
        type="issue"
        identifier="#1234"
        label="A very long title that will truncate"
        href="/i/1"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "title",
      "#1234 A very long title that will truncate",
    );
    expect(link).toHaveAttribute(
      "aria-label",
      "#1234 A very long title that will truncate",
    );
  });

  it("renders aria-disabled and is not focusable when disabled", () => {
    const { container } = render(
      <EntityLink
        type="user"
        label="Cliff"
        href="/u/cliff"
        disabled
      />,
    );
    const link = container.querySelector("a")!;
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).not.toHaveAttribute("href");
  });

  it("renders iconOverride for type='custom'", () => {
    render(
      <EntityLink
        type="custom"
        label="Pinned"
        href="/x"
        iconOverride={<span data-testid="cust">star</span>}
      />,
    );
    expect(screen.getByTestId("cust")).toBeInTheDocument();
  });

  it("forwards ref and spreads remaining props", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <EntityLink
        ref={ref}
        type="user"
        label="Cliff"
        href="/c"
        data-testid="link"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(screen.getByTestId("link")).toBeInTheDocument();
  });

  it("axe passes", async () => {
    const { container } = render(
      <EntityLink type="issue" label="Fix login" href="/x" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("axe passes when disabled", async () => {
    const { container } = render(
      <EntityLink type="issue" label="Fix login" href="/x" disabled />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
