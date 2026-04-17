import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PivotLayout } from "./PivotLayout";

describe("PivotLayout", () => {
  it("renders row headers, column headers, cells, and corner", () => {
    render(
      <PivotLayout
        cornerCell={<span>corner</span>}
        columnHeaders={<div>col-headers</div>}
        rowHeaders={<div>row-headers</div>}
        cells={<div>cells</div>}
      />,
    );
    expect(screen.getByRole("region", { name: "Pivot table" })).toBeInTheDocument();
    expect(screen.getByText("corner")).toBeInTheDocument();
    expect(screen.getByText("col-headers")).toBeInTheDocument();
    expect(screen.getByText("row-headers")).toBeInTheDocument();
    expect(screen.getByText("cells")).toBeInTheDocument();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PivotLayout
        ref={ref}
        className="extra"
        columnHeaders={<div>ch</div>}
        rowHeaders={<div>rh</div>}
        cells={<div>c</div>}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-pivot-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("renders without a corner cell when omitted", () => {
    const { container } = render(
      <PivotLayout
        columnHeaders={<div>ch</div>}
        rowHeaders={<div>rh</div>}
        cells={<div>c</div>}
      />,
    );
    const corner = container.querySelector(".ui-pivot-layout__corner");
    expect(corner).not.toBeNull();
    expect(corner?.textContent).toBe("");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PivotLayout
        columnHeaders={<div>ch</div>}
        rowHeaders={<div>rh</div>}
        cells={<div>c</div>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
