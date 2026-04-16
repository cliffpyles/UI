import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TagInput } from "./TagInput";

describe("TagInput", () => {
  it("adds a tag on Enter", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<TagInput value={[]} onChange={fn} />);
    await user.type(screen.getByLabelText("Add tag"), "foo{Enter}");
    expect(fn).toHaveBeenCalledWith(["foo"]);
  });

  it("removes last on backspace when empty", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<TagInput value={["a", "b"]} onChange={fn} />);
    const input = screen.getByLabelText("Add tag");
    input.focus();
    await user.keyboard("{Backspace}");
    expect(fn).toHaveBeenCalledWith(["a"]);
  });

  it("selects from suggestions", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<TagInput value={[]} onChange={fn} suggestions={["alpha", "beta"]} />);
    await user.click(screen.getByLabelText("Add tag"));
    await user.click(screen.getByRole("option", { name: "alpha" }));
    expect(fn).toHaveBeenCalledWith(["alpha"]);
  });

  it("no a11y violations", async () => {
    const { container } = render(<TagInput value={["a"]} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
