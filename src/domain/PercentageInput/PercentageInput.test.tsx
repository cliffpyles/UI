import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PercentageInput } from "./PercentageInput";

describe("PercentageInput", () => {
  it("shows percent symbol", () => {
    render(<PercentageInput value={50} onChange={() => {}} aria-label="x" />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("clamps to max", () => {
    const calls: (number | null)[] = [];
    render(
      <PercentageInput
        value={null}
        onChange={(v) => calls.push(v)}
        aria-label="x"
        max={50}
      />,
    );
    fireEvent.change(screen.getByLabelText("x"), { target: { value: "99" } });
    expect(calls.at(-1)).toBe(50);
  });

  it("returns null for empty", () => {
    const calls: (number | null)[] = [];
    render(
      <PercentageInput
        value={50}
        onChange={(v) => calls.push(v)}
        aria-label="x"
      />,
    );
    fireEvent.change(screen.getByLabelText("x"), { target: { value: "" } });
    expect(calls.at(-1)).toBeNull();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <PercentageInput value={50} onChange={() => {}} aria-label="x" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
