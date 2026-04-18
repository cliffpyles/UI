import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChartLegend, type ChartLegendItem } from "./ChartLegend";

const ITEMS: ChartLegendItem[] = [
  { id: "a", label: "Alpha", color: "#ff0000" },
  { id: "b", label: "Beta", color: "#00ff00", visible: false },
];

describe("ChartLegend", () => {
  it("renders one entry per item", () => {
    render(<ChartLegend items={ITEMS} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("toggles a series and fires onToggle with new visibility", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ChartLegend items={ITEMS} onToggle={fn} />);
    await user.click(screen.getByRole("button", { name: "Toggle series Alpha" }));
    expect(fn).toHaveBeenCalledWith("a", false);
  });

  it("reflects aria-pressed from visibility", () => {
    render(<ChartLegend items={ITEMS} onToggle={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Toggle series Alpha" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Toggle series Beta" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("skips onToggle for disabled items", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <ChartLegend
        items={[{ id: "x", label: "X", color: "#000", disabled: true }]}
        onToggle={fn}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Toggle series X" }));
    expect(fn).not.toHaveBeenCalled();
  });

  it("returns nothing for empty items", () => {
    const { container } = render(<ChartLegend items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("forwards ref to the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ChartLegend ref={ref} items={ITEMS} />);
    expect(ref.current).not.toBeNull();
  });

  it("no a11y violations (default)", async () => {
    const { container } = render(<ChartLegend items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("no a11y violations (disabled)", async () => {
    const { container } = render(
      <ChartLegend
        items={[{ id: "x", label: "X", color: "#000", disabled: true }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
