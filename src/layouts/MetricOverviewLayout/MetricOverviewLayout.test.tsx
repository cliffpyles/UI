import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MetricOverviewLayout } from "./MetricOverviewLayout";

describe("MetricOverviewLayout", () => {
  it("renders metrics and charts slot", () => {
    render(
      <MetricOverviewLayout
        metrics={[
          <div key="a">Users 100</div>,
          { key: "b", content: <div>Revenue 200</div> },
        ]}
        charts={<div>chart body</div>}
      />,
    );
    expect(screen.getByRole("region", { name: "Metric overview" })).toBeInTheDocument();
    expect(screen.getByText("Users 100")).toBeInTheDocument();
    expect(screen.getByText("Revenue 200")).toBeInTheDocument();
    expect(screen.getByText("chart body")).toBeInTheDocument();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MetricOverviewLayout ref={ref} className="extra" metrics={[<span key="a">m</span>]} />,
    );
    expect(ref.current?.className).toContain("ui-metric-overview");
    expect(ref.current?.className).toContain("extra");
  });

  it("renders without charts", () => {
    const { container } = render(
      <MetricOverviewLayout metrics={[<span key="a">m</span>]} />,
    );
    expect(container.querySelector(".ui-metric-overview__charts")).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <MetricOverviewLayout metrics={[<span key="a">metric</span>]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
