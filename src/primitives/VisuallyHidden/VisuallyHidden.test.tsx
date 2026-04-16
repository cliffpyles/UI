import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders with default props", () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText("Hidden text")).toBeInTheDocument();
  });

  it("renders as span by default", () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);
    expect(screen.getByText("Hidden").tagName).toBe("SPAN");
  });

  it("renders as div when as='div'", () => {
    render(<VisuallyHidden as="div">Hidden</VisuallyHidden>);
    expect(screen.getByText("Hidden").tagName).toBe("DIV");
  });

  it("content is visually hidden (zero dimensions, overflow hidden)", () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const el = screen.getByText("Hidden");
    expect(el).toHaveClass("ui-visually-hidden");
  });

  it("content is present in the accessibility tree", () => {
    render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    expect(screen.getByText("Screen reader text")).toBeInTheDocument();
  });

  it("forwards ref to DOM element", () => {
    const ref = createRef<HTMLElement>();
    render(<VisuallyHidden ref={ref}>Hidden</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.textContent).toBe("Hidden");
  });

  it("spreads additional props onto root element", () => {
    render(<VisuallyHidden data-testid="vh">Hidden</VisuallyHidden>);
    expect(screen.getByTestId("vh")).toBeInTheDocument();
  });

  it("applies className alongside component classes", () => {
    render(<VisuallyHidden className="custom">Hidden</VisuallyHidden>);
    const el = screen.getByText("Hidden");
    expect(el).toHaveClass("ui-visually-hidden");
    expect(el).toHaveClass("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <VisuallyHidden>Accessible hidden text</VisuallyHidden>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
