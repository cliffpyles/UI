import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SmartDateRange } from "./SmartDateRange";

describe("SmartDateRange", () => {
  it("renders inputs", () => {
    render(
      <SmartDateRange value={{ start: null, end: null }} onChange={() => {}} />,
    );
    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
  });

  it("applies preset", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    const now = new Date("2026-04-16T12:00:00Z");
    render(
      <SmartDateRange value={{ start: null, end: null }} onChange={fn} now={now} />,
    );
    await user.click(screen.getByRole("button", { name: "Today" }));
    expect(fn).toHaveBeenCalled();
    const arg = fn.mock.calls[0][0];
    expect(arg.start).toBeInstanceOf(Date);
    expect(arg.end).toBeInstanceOf(Date);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <SmartDateRange value={{ start: null, end: null }} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
