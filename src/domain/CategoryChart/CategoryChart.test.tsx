import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CategoryChart } from "./CategoryChart";

const DATA = [
  { category: "A", value: 10 },
  { category: "B", value: 20 },
];

describe("CategoryChart", () => {
  it("renders chart", () => {
    render(<CategoryChart data={DATA} ariaLabel="sales" />);
    expect(screen.getByRole("img", { name: "sales" })).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<CategoryChart data={[]} />);
    expect(screen.getByText(/No data/)).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<CategoryChart data={DATA} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
