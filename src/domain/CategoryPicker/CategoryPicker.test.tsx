import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CategoryPicker } from "./CategoryPicker";

const CATS = [
  {
    id: "food",
    label: "Food",
    children: [
      { id: "fruit", label: "Fruit" },
      { id: "veg", label: "Vegetables" },
    ],
  },
  { id: "other", label: "Other" },
];

describe("CategoryPicker", () => {
  it("renders tree", () => {
    render(<CategoryPicker categories={CATS} value={null} onChange={() => {}} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("selects single", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<CategoryPicker categories={CATS} value={null} onChange={fn} />);
    await user.click(screen.getByLabelText("Other"));
    expect(fn).toHaveBeenCalledWith("other");
  });

  it("selects multiple", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <CategoryPicker categories={CATS} value={[]} onChange={fn} multiple />,
    );
    await user.click(screen.getByLabelText("Other"));
    expect(fn).toHaveBeenCalledWith(["other"]);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <CategoryPicker categories={CATS} value={null} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
