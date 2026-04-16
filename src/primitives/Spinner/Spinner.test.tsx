import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with role='status'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has default label text 'Loading'", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("uses custom label when provided", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByText("Saving")).toBeInTheDocument();
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("applies size class for sm", () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("ui-spinner--sm");
  });

  it("applies size class for md", () => {
    render(<Spinner size="md" />);
    expect(screen.getByRole("status")).toHaveClass("ui-spinner--md");
  });

  it("applies size class for lg", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("ui-spinner--lg");
  });

  it("defaults to md size", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("ui-spinner--md");
  });

  it("contains an SVG element", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has aria-hidden='true' on the SVG", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref to the DOM element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveRole("status");
  });

  it("spreads additional props", () => {
    render(<Spinner data-testid="my-spinner" id="spinner-1" />);
    const el = screen.getByTestId("my-spinner");
    expect(el).toHaveAttribute("id", "spinner-1");
  });

  it("applies className alongside component classes", () => {
    render(<Spinner className="extra-class" />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("ui-spinner");
    expect(el).toHaveClass("ui-spinner--md");
    expect(el).toHaveClass("extra-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
