import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DistributionChart } from "./DistributionChart";

describe("DistributionChart", () => {
  it("renders with data", () => {
    render(<DistributionChart data={[1, 2, 3, 4, 5]} ariaLabel="dist" />);
    expect(screen.getByRole("img", { name: "dist" })).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<DistributionChart data={[]} />);
    expect(screen.getByText(/No data/)).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<DistributionChart data={[1, 2, 3]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
