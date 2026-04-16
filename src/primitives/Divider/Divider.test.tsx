import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders with role='separator'", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("default orientation is horizontal", () => {
    render(<Divider />);
    const el = screen.getByRole("separator");
    expect(el).toHaveClass("ui-divider--horizontal");
    expect(el).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("applies correct orientation class for horizontal", () => {
    render(<Divider orientation="horizontal" />);
    const el = screen.getByRole("separator");
    expect(el).toHaveClass("ui-divider");
    expect(el).toHaveClass("ui-divider--horizontal");
  });

  it("applies correct orientation class for vertical", () => {
    render(<Divider orientation="vertical" />);
    const el = screen.getByRole("separator");
    expect(el).toHaveClass("ui-divider");
    expect(el).toHaveClass("ui-divider--vertical");
  });

  it("has aria-orientation attribute matching orientation prop", () => {
    const { rerender } = render(<Divider orientation="horizontal" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");

    rerender(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("applies spacing as inline style margin for horizontal", () => {
    render(<Divider spacing="4" />);
    const el = screen.getByRole("separator");
    expect(el.style.marginBlock).toBe("var(--spacing-4)");
  });

  it("applies spacing as inline style margin for vertical", () => {
    render(<Divider orientation="vertical" spacing="2" />);
    const el = screen.getByRole("separator");
    expect(el.style.marginInline).toBe("var(--spacing-2)");
  });

  it("converts dot-notation spacing tokens to CSS var names", () => {
    render(<Divider spacing="0.5" />);
    const el = screen.getByRole("separator");
    expect(el.style.marginBlock).toBe("var(--spacing-0-5)");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props", () => {
    render(<Divider data-testid="custom-divider" />);
    expect(screen.getByTestId("custom-divider")).toBeInTheDocument();
  });

  it("applies className alongside component classes", () => {
    render(<Divider className="custom" />);
    const el = screen.getByRole("separator");
    expect(el).toHaveClass("ui-divider");
    expect(el).toHaveClass("custom");
  });

  it("has no accessibility violations (horizontal)", async () => {
    const { container } = render(<Divider orientation="horizontal" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations (vertical)", async () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
