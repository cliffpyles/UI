import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Text } from "./Text";

describe("Text", () => {
  // Rendering
  it("renders with default props", () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("SPAN");
  });

  it.each([
    ["span", "SPAN"],
    ["p", "P"],
    ["h1", "H1"],
    ["h2", "H2"],
    ["h3", "H3"],
    ["h4", "H4"],
    ["h5", "H5"],
    ["h6", "H6"],
    ["label", "LABEL"],
    ["legend", "LEGEND"],
  ] as const)("renders as %s element", (as, expectedTag) => {
    render(<Text as={as}>Text</Text>);
    expect(screen.getByText("Text").tagName).toBe(expectedTag);
  });

  // Size
  it.each(["2xs", "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"] as const)(
    "applies size class for %s",
    (size) => {
      render(<Text size={size}>Text</Text>);
      expect(screen.getByText("Text")).toHaveClass(`ui-text--${size}`);
    },
  );

  // Weight
  it.each(["normal", "medium", "semibold", "bold"] as const)(
    "applies weight class for %s",
    (weight) => {
      render(<Text weight={weight}>Text</Text>);
      expect(screen.getByText("Text")).toHaveClass(`ui-text--${weight}`);
    },
  );

  // Color
  it.each([
    "primary",
    "secondary",
    "tertiary",
    "disabled",
    "success",
    "warning",
    "error",
    "inherit",
  ] as const)("applies color class for %s", (color) => {
    render(<Text color={color}>Text</Text>);
    expect(screen.getByText("Text")).toHaveClass(`ui-text--${color}`);
  });

  // Family
  it("applies sans family by default", () => {
    render(<Text>Text</Text>);
    expect(screen.getByText("Text")).toHaveClass("ui-text--sans");
  });

  it("applies mono family", () => {
    render(<Text family="mono">Text</Text>);
    expect(screen.getByText("Text")).toHaveClass("ui-text--mono");
  });

  // Alignment
  it.each(["start", "center", "end"] as const)(
    "applies alignment class for %s",
    (align) => {
      render(<Text align={align}>Text</Text>);
      expect(screen.getByText("Text")).toHaveClass(`ui-text--${align}`);
    },
  );

  // Truncation
  it("applies truncate class and title attribute", () => {
    render(<Text truncate>Long text content</Text>);
    const el = screen.getByText("Long text content");
    expect(el).toHaveClass("ui-text--truncate");
    expect(el).toHaveAttribute("title", "Long text content");
  });

  it("uses explicit title over auto-generated title when truncated", () => {
    render(
      <Text truncate title="Custom title">
        Long text
      </Text>,
    );
    expect(screen.getByText("Long text")).toHaveAttribute("title", "Custom title");
  });

  it("does not add title when not truncated", () => {
    render(<Text>Short text</Text>);
    expect(screen.getByText("Short text")).not.toHaveAttribute("title");
  });

  // Tabular numerals
  it("applies tabular-nums class", () => {
    render(<Text tabularNums>1,234.56</Text>);
    expect(screen.getByText("1,234.56")).toHaveClass("ui-text--tabular-nums");
  });

  // API contract
  it("forwards ref to DOM element", () => {
    const ref = createRef<HTMLElement>();
    render(<Text ref={ref}>Hello</Text>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("spreads additional props onto root element", () => {
    render(<Text data-testid="custom">Hello</Text>);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("applies className alongside component classes", () => {
    render(<Text className="custom">Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el).toHaveClass("ui-text");
    expect(el).toHaveClass("custom");
  });

  // Edge cases
  it("handles empty children", () => {
    const { container } = render(<Text>{""}</Text>);
    expect(container.querySelector(".ui-text")).toBeInTheDocument();
  });

  it("handles non-string children without adding title on truncate", () => {
    render(
      <Text truncate>
        <em>Emphasis</em>
      </Text>,
    );
    const el = screen.getByText("Emphasis").closest(".ui-text");
    expect(el).not.toHaveAttribute("title");
  });

  // Accessibility
  it("has no accessibility violations", async () => {
    const { container } = render(<Text>Accessible text</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations as heading", async () => {
    const { container } = render(
      <Text as="h1" size="2xl" weight="bold">
        Page Title
      </Text>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
