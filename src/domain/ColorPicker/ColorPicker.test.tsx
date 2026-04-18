import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ColorPicker } from "./ColorPicker";

const PALETTE = [
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
];

describe("ColorPicker", () => {
  it("renders placeholder when value is null", () => {
    render(<ColorPicker value={null} onChange={() => {}} palette={PALETTE} />);
    expect(screen.getByText("Pick color")).toBeInTheDocument();
  });

  it("selects a swatch from the palette and calls onChange", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ColorPicker value={null} onChange={fn} palette={PALETTE} />);
    await user.click(screen.getByRole("button", { name: "Pick color" }));
    await user.click(screen.getByRole("button", { name: "Red (#ff0000)" }));
    expect(fn).toHaveBeenCalledWith("#ff0000");
  });

  it("marks the selected swatch with aria-pressed=true", async () => {
    const user = userEvent.setup();
    render(<ColorPicker value="#ff0000" onChange={() => {}} palette={PALETTE} />);
    await user.click(screen.getByRole("button", { name: "Red" }));
    expect(
      screen.getByRole("button", { name: "Red (#ff0000)" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("allowCustom renders a hex input and rejects invalid hex", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <ColorPicker value={null} onChange={fn} palette={PALETTE} allowCustom />,
    );
    await user.click(screen.getByRole("button", { name: "Pick color" }));
    const input = screen.getByLabelText("Custom hex color");
    await user.type(input, "nope");
    expect(fn).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, "#abcdef");
    expect(fn).toHaveBeenLastCalledWith("#abcdef");
  });

  it("disabled prevents opening the popover", async () => {
    const user = userEvent.setup();
    render(
      <ColorPicker value={null} onChange={() => {}} palette={PALETTE} disabled />,
    );
    await user.click(screen.getByRole("button", { name: "Pick color" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards ref to the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ColorPicker
        ref={ref}
        value={null}
        onChange={() => {}}
        palette={PALETTE}
      />,
    );
    expect(ref.current).not.toBeNull();
  });

  it("no a11y violations (default)", async () => {
    const { container } = render(
      <ColorPicker value={null} onChange={() => {}} palette={PALETTE} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("no a11y violations (selected)", async () => {
    const { container } = render(
      <ColorPicker value="#ff0000" onChange={() => {}} palette={PALETTE} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
