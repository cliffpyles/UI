import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { HeatmapGrid } from "./HeatmapGrid";

const DATA = [
  [1, 2, 3],
  [4, 5, 6],
];

describe("HeatmapGrid", () => {
  it("renders values", () => {
    render(<HeatmapGrid data={DATA} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders labels", () => {
    render(
      <HeatmapGrid data={DATA} xLabels={["Mon", "Tue", "Wed"]} yLabels={["AM", "PM"]} />,
    );
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<HeatmapGrid data={[]} />);
    expect(screen.getByText(/No data/)).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <HeatmapGrid data={DATA} xLabels={["A", "B", "C"]} yLabels={["1", "2"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
