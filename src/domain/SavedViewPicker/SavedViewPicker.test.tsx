import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SavedViewPicker } from "./SavedViewPicker";

const VIEWS = [
  { id: "a", name: "All", isDefault: true },
  { id: "b", name: "Mine" },
];

describe("SavedViewPicker", () => {
  it("shows current view", () => {
    render(<SavedViewPicker views={VIEWS} current="b" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /Mine/ })).toBeInTheDocument();
  });

  it("selects a view", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<SavedViewPicker views={VIEWS} current="a" onChange={fn} />);
    await user.click(screen.getByRole("button", { name: /All/ }));
    await user.click(screen.getByRole("button", { name: "Mine" }));
    expect(fn).toHaveBeenCalledWith("b");
  });

  it("saves a new view", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <SavedViewPicker
        views={VIEWS}
        current="a"
        onChange={() => {}}
        onSave={onSave}
      />,
    );
    await user.click(screen.getByRole("button", { name: /All/ }));
    await user.click(screen.getByRole("button", { name: /Save current view/ }));
    await user.type(screen.getByRole("textbox", { name: "New view name" }), "Fresh{enter}");
    expect(onSave).toHaveBeenCalledWith("Fresh");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <SavedViewPicker views={VIEWS} current="a" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
