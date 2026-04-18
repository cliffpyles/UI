import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Box } from "./Box";

describe("Box", () => {
  // Rendering
  it("renders with default props", () => {
    render(<Box data-testid="box">Content</Box>);
    const el = screen.getByTestId("box");
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("DIV");
  });

  it.each([
    ["div", "DIV"],
    ["section", "SECTION"],
    ["article", "ARTICLE"],
    ["aside", "ASIDE"],
    ["main", "MAIN"],
    ["nav", "NAV"],
    ["header", "HEADER"],
    ["footer", "FOOTER"],
  ] as const)("renders as %s element", (as, expectedTag) => {
    render(
      <Box as={as} data-testid="box">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box").tagName).toBe(expectedTag);
  });

  // Spacing props
  it("applies padding as inline style", () => {
    render(<Box padding="4" data-testid="box" />);
    expect(screen.getByTestId("box").style.padding).toBe("var(--spacing-4)");
  });

  it("applies paddingX as inline style", () => {
    render(<Box paddingX="2" data-testid="box" />);
    expect(screen.getByTestId("box").style.paddingInline).toBe("var(--spacing-2)");
  });

  it("applies paddingY as inline style", () => {
    render(<Box paddingY="3" data-testid="box" />);
    expect(screen.getByTestId("box").style.paddingBlock).toBe("var(--spacing-3)");
  });

  it("applies gap as inline style", () => {
    render(<Box gap="2" data-testid="box" />);
    expect(screen.getByTestId("box").style.gap).toBe("var(--spacing-2)");
  });

  it("handles decimal spacing tokens", () => {
    render(<Box padding="0.5" data-testid="box" />);
    expect(screen.getByTestId("box").style.padding).toBe("var(--spacing-0-5)");
  });

  it.each([
    ["content", "var(--spacing-content-gap)"],
    ["section", "var(--spacing-section-gap)"],
    ["inline", "var(--spacing-inline-gap)"],
  ] as const)("resolves semantic gap %s to its density-aware token", (token, css) => {
    render(<Box gap={token} data-testid="box" />);
    expect(screen.getByTestId("box").style.gap).toBe(css);
  });

  it("resolves semantic padding `page` to --spacing-page-padding", () => {
    render(<Box padding="page" data-testid="box" />);
    expect(screen.getByTestId("box").style.padding).toBe("var(--spacing-page-padding)");
  });

  // Display
  it("applies display mode", () => {
    render(<Box display="flex" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ display: "flex" });
  });

  it.each([
    ["direction", { direction: "column" }],
    ["align", { align: "center" }],
    ["justify", { justify: "between" }],
    ["wrap", { wrap: true }],
  ] as const)(
    "defaults display to flex when %s is set",
    (_label, props) => {
      render(<Box {...props} data-testid="box" />);
      expect(screen.getByTestId("box")).toHaveStyle({ display: "flex" });
    },
  );

  it("does not default display when only padding/gap/background are set", () => {
    render(<Box padding="2" gap="2" background="surface" data-testid="box" />);
    expect(screen.getByTestId("box").style.display).toBe("");
  });

  it("respects an explicit display when flex props are also set", () => {
    render(
      <Box display="inline-flex" align="center" data-testid="box" />,
    );
    expect(screen.getByTestId("box")).toHaveStyle({ display: "inline-flex" });
  });

  it("applies flex direction", () => {
    render(<Box display="flex" direction="column" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "flex-direction": "column" });
  });

  // Alignment
  it("applies align items", () => {
    render(<Box display="flex" align="center" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "align-items": "center" });
  });

  it("applies justify content with 'between'", () => {
    render(<Box display="flex" justify="between" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({
      "justify-content": "space-between",
    });
  });

  // Flex extras
  it("applies flex-wrap when wrap is true", () => {
    render(<Box display="flex" wrap data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "flex-wrap": "wrap" });
  });

  it("does not set flex-wrap when wrap is false", () => {
    render(<Box display="flex" data-testid="box" />);
    expect(screen.getByTestId("box").style.flexWrap).toBe("");
  });

  it("applies flex-grow with boolean shorthand", () => {
    render(<Box display="flex" grow data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "flex-grow": "1" });
  });

  it("applies flex-grow with explicit 0", () => {
    render(<Box display="flex" grow={0} data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "flex-grow": "0" });
  });

  it("applies flex-shrink with boolean shorthand", () => {
    render(<Box display="flex" shrink={false} data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "flex-shrink": "0" });
  });

  it("applies flex-shrink with explicit 1", () => {
    render(<Box display="flex" shrink={1} data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "flex-shrink": "1" });
  });

  it("applies minWidth=0 as min-inline-size: 0 (ellipsis in flex)", () => {
    render(<Box display="flex" grow minWidth={0} data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "min-inline-size": "0" });
  });

  it("applies minWidth=auto as min-inline-size: auto", () => {
    render(<Box minWidth="auto" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({ "min-inline-size": "auto" });
  });

  it("does not set min-inline-size when minWidth is omitted", () => {
    render(<Box data-testid="box" />);
    expect(screen.getByTestId("box").style.minInlineSize).toBe("");
  });

  // Background
  it("applies surface background", () => {
    render(<Box background="surface" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({
      "background-color": "var(--color-background-surface)",
    });
  });

  it("applies raised background", () => {
    render(<Box background="raised" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({
      "background-color": "var(--color-background-surface-raised)",
    });
  });

  it("applies sunken background", () => {
    render(<Box background="sunken" data-testid="box" />);
    expect(screen.getByTestId("box")).toHaveStyle({
      "background-color": "var(--color-background-surface-sunken)",
    });
  });

  // Radius
  it.each(["none", "sm", "md", "lg", "xl", "full"] as const)(
    "applies radius class for %s",
    (radius) => {
      render(<Box radius={radius} data-testid="box" />);
      expect(screen.getByTestId("box")).toHaveClass(`ui-box--radius-${radius}`);
    },
  );

  // Shadow
  it.each(["none", "sm", "md", "lg"] as const)(
    "applies shadow class for %s",
    (shadow) => {
      render(<Box shadow={shadow} data-testid="box" />);
      expect(screen.getByTestId("box")).toHaveClass(`ui-box--shadow-${shadow}`);
    },
  );

  // API contract
  it("forwards ref to DOM element", () => {
    const ref = createRef<HTMLElement>();
    render(<Box ref={ref}>Content</Box>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto root element", () => {
    render(
      <Box data-testid="box" aria-label="container">
        Content
      </Box>,
    );
    expect(screen.getByTestId("box")).toHaveAttribute("aria-label", "container");
  });

  it("applies className alongside component classes", () => {
    render(<Box className="custom" data-testid="box" />);
    const el = screen.getByTestId("box");
    expect(el).toHaveClass("ui-box");
    expect(el).toHaveClass("custom");
  });

  it("merges custom style with generated styles", () => {
    render(
      <Box padding="4" style={{ border: "1px solid red" }} data-testid="box" />,
    );
    const el = screen.getByTestId("box");
    expect(el.style.padding).toBe("var(--spacing-4)");
    expect(el.style.border).toBe("1px solid red");
  });

  // Accessibility
  it("has no accessibility violations", async () => {
    const { container } = render(<Box>Content</Box>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations as nav", async () => {
    const { container } = render(
      <Box as="nav" aria-label="Main navigation">
        Nav content
      </Box>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
