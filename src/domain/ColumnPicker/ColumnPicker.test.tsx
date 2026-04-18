import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
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
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[2]);
    expect(fn).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("disables required columns", async () => {
    const user = userEvent.setup();
    render(<ColumnPicker columns={COLS} visible={["a"]} onChange={() => {}} />);
    await user.click(screen.getByRole("button", { name: /Columns/ }));
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).not.toBeDisabled();
  });

  it("trigger label announces N of M visible", () => {
    render(<ColumnPicker columns={COLS} visible={["a", "b"]} onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Columns, 2 of 3 visible" }),
    ).toBeInTheDocument();
  });

  it("renders Reset and invokes onReset", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(
      <ColumnPicker
        columns={COLS}
        visible={["a", "b"]}
        onChange={() => {}}
        onReset={reset}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Columns/ }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(reset).toHaveBeenCalled();
  });

  it("reorders with Alt+ArrowDown", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <ColumnPicker
        columns={COLS}
        visible={["a", "b", "c"]}
        onChange={fn}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Columns/ }));
    const items = await screen.findAllByRole("menuitem");
    items[1].focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(fn).toHaveBeenCalledWith(["a", "c", "b"]);
  });

  it("forwards ref and spreads props", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ColumnPicker
        ref={ref}
        columns={COLS}
        visible={["a"]}
        onChange={() => {}}
        data-testid="picker"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("picker")).toBe(ref.current);
  });

  it("merges className", () => {
    render(
      <ColumnPicker
        columns={COLS}
        visible={["a"]}
        onChange={() => {}}
        className="custom"
        data-testid="picker"
      />,
    );
    expect(screen.getByTestId("picker").className).toContain("ui-column-picker");
    expect(screen.getByTestId("picker").className).toContain("custom");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ColumnPicker columns={COLS} visible={["a"]} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
