import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Icon } from "./Icon";
import { iconPaths } from "./icons";
import type { IconName } from "./icons";

describe("Icon", () => {
  // Rendering
  it("renders an SVG element", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default size sm (16px)", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  // Size
  it.each([
    ["xs", "12"],
    ["sm", "16"],
    ["md", "20"],
    ["lg", "24"],
    ["xl", "32"],
  ] as const)("renders at correct dimensions for size %s", (size, px) => {
    const { container } = render(<Icon name="check" size={size} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", px);
    expect(svg).toHaveAttribute("height", px);
  });

  // Stroke width per design spec
  it("uses 1.5px stroke for sm/md sizes", () => {
    const { container } = render(<Icon name="check" size="sm" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("stroke-width", "1.5");
  });

  it("uses 2px stroke for lg/xl sizes", () => {
    const { container } = render(<Icon name="check" size="lg" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("stroke-width", "2");
  });

  // Color
  it("uses currentColor by default", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("stroke", "currentColor");
  });

  it("applies override color correctly", () => {
    const { container } = render(<Icon name="check" color="error" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute(
      "stroke",
      "var(--color-status-error-icon)",
    );
  });

  // Accessibility
  it("sets aria-hidden='true' when no label", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
  });

  it("sets role='img' and aria-label when label is provided", () => {
    render(<Icon name="check" label="Checkmark" />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("aria-label", "Checkmark");
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  // Icon set completeness
  it("has at least 30 icons in the icon set", () => {
    const names = Object.keys(iconPaths);
    expect(names.length).toBeGreaterThanOrEqual(30);
  });

  it.each([
    "chevron-down",
    "chevron-right",
    "chevron-up",
    "chevron-left",
    "x",
    "check",
    "search",
    "plus",
    "minus",
    "info",
    "alert-triangle",
    "alert-circle",
    "loader",
    "external-link",
    "edit",
    "trash",
    "copy",
    "download",
    "upload",
    "filter",
    "sort-asc",
    "sort-desc",
    "more-horizontal",
    "eye",
    "eye-off",
    "calendar",
    "clock",
    "user",
    "settings",
    "refresh",
  ] as IconName[])("renders icon '%s' without crashing", (name) => {
    const { container } = render(<Icon name={name} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  // API contract
  it("forwards ref to SVG element", () => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon name="check" ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("spreads additional props onto SVG element", () => {
    const { container } = render(
      <Icon name="check" data-testid="icon" />,
    );
    expect(container.querySelector("[data-testid='icon']")).toBeInTheDocument();
  });

  it("applies className alongside component classes", () => {
    const { container } = render(
      <Icon name="check" className="custom" />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("ui-icon");
    expect(svg).toHaveClass("custom");
  });

  // Accessibility
  it("has no accessibility violations (decorative)", async () => {
    const { container } = render(
      <span>
        Save <Icon name="check" />
      </span>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations (labeled)", async () => {
    const { container } = render(
      <Icon name="check" label="Success" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
