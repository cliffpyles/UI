import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { LabelPicker } from "./LabelPicker";

const LABELS = [
  { id: "a", name: "Bug" },
  { id: "b", name: "Feature" },
];

describe("LabelPicker", () => {
  it("selects a label", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<LabelPicker value={[]} onChange={fn} labels={LABELS} />);
    await user.click(screen.getByLabelText("Search labels"));
    await user.click(screen.getByRole("option", { name: /Bug/ }));
    expect(fn).toHaveBeenCalledWith(["a"]);
  });

  it("offers create when allowed", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <LabelPicker
        value={[]}
        onChange={() => {}}
        labels={LABELS}
        allowCreate
        onCreate={onCreate}
      />,
    );
    await user.click(screen.getByLabelText("Search labels"));
    await user.type(screen.getByLabelText("Search labels"), "Chore");
    await user.click(screen.getByRole("option", { name: /Create/ }));
    expect(onCreate).toHaveBeenCalledWith("Chore");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <LabelPicker value={[]} onChange={() => {}} labels={LABELS} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
