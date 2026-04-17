import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ChartGridLayout } from "./ChartGridLayout";

describe("ChartGridLayout", () => {
  it("renders all chart items", () => {
    render(
      <ChartGridLayout
        charts={[
          { id: "a", content: <div>chart a</div>, colSpan: 6 },
          { id: "b", content: <div>chart b</div>, colSpan: 6, rowSpan: 2 },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Chart grid" })).toBeInTheDocument();
    expect(screen.getByText("chart a")).toBeInTheDocument();
    expect(screen.getByText("chart b")).toBeInTheDocument();
  });

  it("applies colSpan via gridColumn style", () => {
    const { container } = render(
      <ChartGridLayout
        charts={[{ id: "a", content: <span>x</span>, colSpan: 4 }]}
      />,
    );
    const item = container.querySelector<HTMLElement>(".ui-chart-grid__item");
    expect(item?.style.gridColumn).toBe("span 4");
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ChartGridLayout
        ref={ref}
        className="extra"
        charts={[{ id: "a", content: <span>x</span> }]}
      />,
    );
    expect(ref.current?.className).toContain("ui-chart-grid");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ChartGridLayout charts={[{ id: "a", content: <span>x</span> }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
