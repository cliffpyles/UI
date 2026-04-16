import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a skeleton element", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // --- Variants ---

  it("applies text variant by default", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toHaveClass("ui-skeleton--text");
  });

  it("applies circle variant", () => {
    render(<Skeleton variant="circle" width={48} />);
    expect(screen.getByRole("status")).toHaveClass("ui-skeleton--circle");
  });

  it("applies rect variant", () => {
    render(<Skeleton variant="rect" width={200} height={100} />);
    expect(screen.getByRole("status")).toHaveClass("ui-skeleton--rect");
  });

  // --- Dimensions ---

  it("renders with default dimensions", () => {
    render(<Skeleton />);
    const el = screen.getByRole("status");
    expect(el).toHaveStyle({ width: "100%", height: "1em" });
  });

  it("renders with custom width and height", () => {
    render(<Skeleton width={200} height={40} />);
    const el = screen.getByRole("status");
    expect(el).toHaveStyle({ width: "200px", height: "40px" });
  });

  it("renders with string CSS values", () => {
    render(<Skeleton width="50%" height="2rem" />);
    const el = screen.getByRole("status");
    expect(el).toHaveStyle({ width: "50%", height: "2rem" });
  });

  it("circle uses width for both dimensions", () => {
    render(<Skeleton variant="circle" width={48} />);
    const el = screen.getByRole("status");
    expect(el).toHaveStyle({ width: "48px", height: "48px" });
  });

  // --- Multiple lines ---

  it("renders multiple skeleton rows", () => {
    const { container } = render(<Skeleton lines={3} />);
    const skeletons = container.querySelectorAll(".ui-skeleton");
    expect(skeletons).toHaveLength(3);
  });

  it("last line is shorter (80% width)", () => {
    const { container } = render(<Skeleton lines={3} />);
    const skeletons = container.querySelectorAll(".ui-skeleton");
    expect(skeletons[2]).toHaveStyle({ width: "80%" });
  });

  it("single line does not render a group", () => {
    render(<Skeleton lines={1} />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("ui-skeleton");
    expect(el).not.toHaveClass("ui-skeleton__group");
  });

  // --- ARIA ---

  it("has aria-busy='true'", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("has appropriate aria-label", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading content",
    );
  });

  // --- Animation class ---

  it("has animation class on the element", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toHaveClass("ui-skeleton");
  });

  // --- Ref forwarding ---

  it("forwards ref to the element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref to the group wrapper for multi-line", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} lines={3} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-skeleton__group");
  });

  // --- className merging ---

  it("merges custom className", () => {
    render(<Skeleton className="custom" />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("ui-skeleton");
    expect(el).toHaveClass("custom");
  });

  // --- Prop spreading ---

  it("spreads additional props", () => {
    render(<Skeleton data-testid="skel" id="skel-1" />);
    expect(screen.getByTestId("skel")).toHaveAttribute("id", "skel-1");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with multiple lines", async () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
