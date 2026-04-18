import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Grid } from "./Grid";

describe("Grid", () => {
  it("renders with default props", () => {
    render(<Grid data-testid="grid">Content</Grid>);
    const el = screen.getByTestId("grid");
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("ui-grid");
  });

  it.each([
    ["div", "DIV"],
    ["section", "SECTION"],
    ["ul", "UL"],
    ["dl", "DL"],
  ] as const)("renders as %s element", (as, expectedTag) => {
    render(
      <Grid as={as} data-testid="grid">
        Content
      </Grid>,
    );
    expect(screen.getByTestId("grid").tagName).toBe(expectedTag);
  });

  it("expands numeric columns into a repeat(N, minmax(0, 1fr)) template", () => {
    render(<Grid columns={3} data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gridTemplateColumns).toBe(
      "repeat(3, minmax(0, 1fr))",
    );
  });

  it("passes through string columns verbatim", () => {
    render(<Grid columns="200px 1fr auto" data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gridTemplateColumns).toBe(
      "200px 1fr auto",
    );
  });

  it("expands numeric rows into a repeat(N, minmax(0, 1fr)) template", () => {
    render(<Grid rows={2} data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gridTemplateRows).toBe(
      "repeat(2, minmax(0, 1fr))",
    );
  });

  it("applies gap as inline style", () => {
    render(<Grid gap="4" data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gap).toBe("var(--spacing-4)");
  });

  it("applies columnGap and rowGap independently", () => {
    render(<Grid columnGap="2" rowGap="6" data-testid="grid" />);
    const el = screen.getByTestId("grid");
    expect(el.style.columnGap).toBe("var(--spacing-2)");
    expect(el.style.rowGap).toBe("var(--spacing-6)");
  });

  it("handles decimal spacing tokens", () => {
    render(<Grid gap="0.5" data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gap).toBe("var(--spacing-0-5)");
  });

  it.each([
    ["content", "var(--spacing-content-gap)"],
    ["section", "var(--spacing-section-gap)"],
    ["inline", "var(--spacing-inline-gap)"],
  ] as const)("resolves semantic gap %s to its density-aware token", (token, css) => {
    render(<Grid gap={token} data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gap).toBe(css);
  });

  it("applies autoFlow", () => {
    render(<Grid autoFlow="column" data-testid="grid" />);
    expect(screen.getByTestId("grid")).toHaveStyle({ "grid-auto-flow": "column" });
  });

  it("builds templateAreas from an array of rows", () => {
    render(
      <Grid
        templateAreas={["header header", "sidebar main"]}
        data-testid="grid"
      />,
    );
    expect(screen.getByTestId("grid").style.gridTemplateAreas).toBe(
      '"header header" "sidebar main"',
    );
  });

  it("passes templateAreas strings through verbatim", () => {
    render(
      <Grid templateAreas='"a a" "b c"' data-testid="grid" />,
    );
    expect(screen.getByTestId("grid").style.gridTemplateAreas).toBe(
      '"a a" "b c"',
    );
  });

  it("applies padding as inline style", () => {
    render(<Grid padding="4" data-testid="grid" />);
    expect(screen.getByTestId("grid").style.padding).toBe("var(--spacing-4)");
  });

  it("applies paddingX/paddingY independently", () => {
    render(<Grid paddingX="2" paddingY="3" data-testid="grid" />);
    const el = screen.getByTestId("grid");
    expect(el.style.paddingInline).toBe("var(--spacing-2)");
    expect(el.style.paddingBlock).toBe("var(--spacing-3)");
  });

  it("resolves semantic padding `page` to --spacing-page-padding", () => {
    render(<Grid padding="page" data-testid="grid" />);
    expect(screen.getByTestId("grid").style.padding).toBe(
      "var(--spacing-page-padding)",
    );
  });

  it("forwards ref to DOM element", () => {
    const ref = createRef<HTMLElement>();
    render(<Grid ref={ref}>Content</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props onto root element", () => {
    render(
      <Grid data-testid="grid" aria-label="layout">
        Content
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveAttribute("aria-label", "layout");
  });

  it("applies className alongside component classes", () => {
    render(<Grid className="custom" data-testid="grid" />);
    const el = screen.getByTestId("grid");
    expect(el).toHaveClass("ui-grid");
    expect(el).toHaveClass("custom");
  });

  it("merges custom style with generated styles", () => {
    render(
      <Grid gap="4" style={{ border: "1px solid red" }} data-testid="grid" />,
    );
    const el = screen.getByTestId("grid");
    expect(el.style.gap).toBe("var(--spacing-4)");
    expect(el.style.border).toBe("1px solid red");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Grid>Content</Grid>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
