import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FunnelChart } from "./FunnelChart";

const STAGES = [
  { label: "Visit", value: 1000 },
  { label: "Signup", value: 400 },
  { label: "Purchase", value: 100 },
];

describe("FunnelChart", () => {
  it("renders stages with conversion", () => {
    render(<FunnelChart stages={STAGES} />);
    expect(screen.getByText("Visit")).toBeInTheDocument();
    expect(screen.getByText("40.0% conversion")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<FunnelChart stages={[]} />);
    expect(screen.getByText(/No data/)).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<FunnelChart stages={STAGES} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
