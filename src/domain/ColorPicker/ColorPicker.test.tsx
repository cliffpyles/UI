import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  it("selects a color", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ColorPicker value="#000000" onChange={fn} palette={["#ff0000", "#00ff00"]} />);
    await user.click(screen.getByRole("radio", { name: "#ff0000" }));
    expect(fn).toHaveBeenCalledWith("#ff0000");
  });

  it("marks selected", () => {
    render(<ColorPicker value="#ff0000" onChange={() => {}} palette={["#ff0000"]} />);
    expect(screen.getByRole("radio", { name: "#ff0000" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ColorPicker value="#ff0000" onChange={() => {}} palette={["#ff0000"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
