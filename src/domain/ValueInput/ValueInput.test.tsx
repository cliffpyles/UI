import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ValueInput } from "./ValueInput";

describe("ValueInput", () => {
  it("renders text input for string", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ValueInput fieldType="string" value="" onChange={fn} />);
    await user.type(screen.getByLabelText("Value"), "hi");
    expect(fn).toHaveBeenCalled();
  });

  it("renders number input", () => {
    render(<ValueInput fieldType="number" value={5} onChange={() => {}} />);
    expect(screen.getByLabelText("Value")).toHaveAttribute("type", "number");
  });

  it("renders date input", () => {
    render(<ValueInput fieldType="date" value="2026-01-01" onChange={() => {}} />);
    expect(screen.getByLabelText("Value")).toHaveAttribute("type", "date");
  });

  it("renders enum select", () => {
    render(
      <ValueInput
        fieldType="enum"
        value="a"
        onChange={() => {}}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders boolean toggle", () => {
    render(<ValueInput fieldType="boolean" value={false} onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ValueInput fieldType="string" value="hi" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
