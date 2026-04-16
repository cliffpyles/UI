import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChartLegend } from "./ChartLegend";

const SERIES = [
  { id: "a", label: "Alpha", color: "#ff0000" },
  { id: "b", label: "Beta", color: "#00ff00", visible: false },
];

describe("ChartLegend", () => {
  it("renders series", () => {
    render(<ChartLegend series={SERIES} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("toggles series", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ChartLegend series={SERIES} onToggle={fn} />);
    await user.click(screen.getByRole("button", { name: /Alpha/ }));
    expect(fn).toHaveBeenCalledWith("a");
  });

  it("no a11y violations", async () => {
    const { container } = render(<ChartLegend series={SERIES} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
