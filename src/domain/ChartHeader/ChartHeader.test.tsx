import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChartHeader } from "./ChartHeader";

describe("ChartHeader", () => {
  it("renders title and subtitle", () => {
    render(<ChartHeader title="Revenue" subtitle="Monthly" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("fires onExport", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ChartHeader title="X" onExport={fn} />);
    await user.click(screen.getByRole("button", { name: "Export chart" }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(<ChartHeader title="X" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
