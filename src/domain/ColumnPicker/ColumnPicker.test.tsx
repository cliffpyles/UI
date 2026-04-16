import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ColumnPicker } from "./ColumnPicker";

const COLS = [
  { id: "a", label: "Name", required: true },
  { id: "b", label: "Email" },
  { id: "c", label: "Role" },
];

describe("ColumnPicker", () => {
  it("toggles column visibility", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ColumnPicker columns={COLS} visible={["a", "b"]} onChange={fn} />);
    await user.click(screen.getByRole("button", { name: /Columns/ }));
    await user.click(screen.getByLabelText("Role"));
    expect(fn).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("disables required columns", async () => {
    const user = userEvent.setup();
    render(<ColumnPicker columns={COLS} visible={["a"]} onChange={() => {}} />);
    await user.click(screen.getByRole("button", { name: /Columns/ }));
    expect(screen.getByLabelText("Name")).toBeDisabled();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ColumnPicker columns={COLS} visible={["a"]} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
