import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { PriorityPicker } from "./PriorityPicker";

describe("PriorityPicker", () => {
  it("renders default priorities", () => {
    render(<PriorityPicker value="medium" onChange={() => {}} />);
    expect(screen.getByRole("combobox")).toHaveValue("medium");
  });

  it("fires onChange", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<PriorityPicker value="low" onChange={fn} />);
    await user.selectOptions(screen.getByRole("combobox"), "high");
    expect(fn).toHaveBeenCalledWith("high");
  });

  it("no a11y violations", async () => {
    const { container } = render(<PriorityPicker value="medium" onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
