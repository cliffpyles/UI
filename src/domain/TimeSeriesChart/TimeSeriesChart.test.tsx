import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TimeSeriesChart } from "./TimeSeriesChart";

const SERIES = [
  {
    id: "a",
    label: "A",
    color: "#3b82f6",
    data: [
      { x: "2026-01-01", y: 10 },
      { x: "2026-02-01", y: 20 },
      { x: "2026-03-01", y: 15 },
    ],
  },
];

describe("TimeSeriesChart", () => {
  it("renders chart with data", () => {
    render(<TimeSeriesChart series={SERIES} ariaLabel="revenue" />);
    expect(screen.getByRole("img", { name: "revenue" })).toBeInTheDocument();
  });

  it("renders empty state with no data", () => {
    render(<TimeSeriesChart series={[]} />);
    expect(screen.getByText(/No data/)).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<TimeSeriesChart series={SERIES} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
