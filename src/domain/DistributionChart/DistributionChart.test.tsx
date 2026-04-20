import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DistributionChart } from "./DistributionChart";

const SAMPLE = [1, 2, 2, 3, 3, 3, 4, 5, 5, 6];

describe("DistributionChart", () => {
  it("renders one bar per bucket in histogram mode", () => {
    const { container } = render(
      <DistributionChart values={SAMPLE} bucketCount={5} />,
    );
    expect(
      container.querySelectorAll(".ui-distribution-chart__bar"),
    ).toHaveLength(5);
  });

  it("renders a single density curve in density mode", () => {
    const { container } = render(
      <DistributionChart values={SAMPLE} mode="density" />,
    );
    expect(
      container.querySelectorAll(".ui-distribution-chart__density"),
    ).toHaveLength(1);
  });

  it("uses pre-computed buckets when provided, ignoring bucketCount", () => {
    const buckets = [
      { min: 0, max: 10, count: 3 },
      { min: 10, max: 20, count: 7 },
    ];
    const { container } = render(
      <DistributionChart values={[]} buckets={buckets} bucketCount={20} />,
    );
    expect(
      container.querySelectorAll(".ui-distribution-chart__bar"),
    ).toHaveLength(2);
  });

  it("shows ChartTooltip on bar hover with bucket range and count", () => {
    const { container } = render(
      <DistributionChart values={SAMPLE} bucketCount={3} />,
    );
    const bar = container.querySelector(
      ".ui-distribution-chart__bar",
    ) as SVGRectElement;
    fireEvent.mouseEnter(bar);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("renders EmptyChart when values is empty and no buckets given", () => {
    render(<DistributionChart values={[]} />);
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });

  it("renders Skeleton when loading", () => {
    const { container } = render(
      <DistributionChart values={SAMPLE} loading />,
    );
    expect(container.querySelector(".ui-skeleton")).not.toBeNull();
  });

  it("forwards ref to root div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DistributionChart ref={ref} values={SAMPLE} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads remaining props onto root", () => {
    render(
      <DistributionChart
        data-testid="dist"
        values={SAMPLE}
      />,
    );
    expect(screen.getByTestId("dist")).toBeInTheDocument();
  });

  it("uses formatValue for axis labels and tooltip", () => {
    render(
      <DistributionChart
        values={SAMPLE}
        bucketCount={2}
        formatValue={(n) => `~${n.toFixed(0)}`}
      />,
    );
    expect(screen.getAllByText(/^~/).length).toBeGreaterThan(0);
  });

  it("passes axe in default state", async () => {
    const { container } = render(
      <DistributionChart values={SAMPLE} bucketCount={4} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe in empty state", async () => {
    const { container } = render(<DistributionChart values={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("passes axe in loading state", async () => {
    const { container } = render(
      <DistributionChart values={SAMPLE} loading />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
