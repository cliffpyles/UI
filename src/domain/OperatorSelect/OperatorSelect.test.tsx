import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { OperatorSelect } from "./OperatorSelect";

describe("OperatorSelect", () => {
  it("shows operators for string type", () => {
    render(<OperatorSelect fieldType="string" value="eq" onChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select.querySelectorAll("option").length).toBeGreaterThan(3);
    expect(screen.getByText("contains")).toBeInTheDocument();
  });

  it("shows operators for date type (no contains)", () => {
    render(<OperatorSelect fieldType="date" value="eq" onChange={() => {}} />);
    expect(screen.queryByText("contains")).not.toBeInTheDocument();
    expect(screen.getByText("before")).toBeInTheDocument();
  });

  it("fires onChange", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<OperatorSelect fieldType="string" value="eq" onChange={fn} />);
    await user.selectOptions(screen.getByRole("combobox"), "contains");
    expect(fn).toHaveBeenCalledWith("contains");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <OperatorSelect fieldType="number" value="eq" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
