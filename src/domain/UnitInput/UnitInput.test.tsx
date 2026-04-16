import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { UnitInput } from "./UnitInput";

const UNITS = [
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

describe("UnitInput", () => {
  it("renders inputs", () => {
    render(
      <UnitInput
        value={10}
        onChange={() => {}}
        unit="kg"
        onUnitChange={() => {}}
        units={UNITS}
        aria-label="weight"
      />,
    );
    expect(screen.getByRole("spinbutton")).toHaveValue(10);
    expect(screen.getByLabelText("Unit")).toHaveValue("kg");
  });

  it("fires unit change", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <UnitInput
        value={10}
        onChange={() => {}}
        unit="kg"
        onUnitChange={fn}
        units={UNITS}
      />,
    );
    await user.selectOptions(screen.getByLabelText("Unit"), "lb");
    expect(fn).toHaveBeenCalledWith("lb");
  });

  it("fires numeric change", () => {
    const fn = vi.fn();
    render(
      <UnitInput
        value={null}
        onChange={fn}
        unit="kg"
        onUnitChange={() => {}}
        units={UNITS}
      />,
    );
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "7" } });
    expect(fn).toHaveBeenCalledWith(7);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <label>
        Weight
        <UnitInput
          value={10}
          onChange={() => {}}
          unit="kg"
          onUnitChange={() => {}}
          units={UNITS}
        />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
