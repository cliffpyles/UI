import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CategoryPicker, type CategoryNode } from "./CategoryPicker";

const OPTIONS: CategoryNode[] = [
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
  it("renders the placeholder when no value is selected", () => {
    render(
      <CategoryPicker options={OPTIONS} value={null} onChange={() => {}} />,
    );
    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  it("renders the resolved path when a leaf is selected", () => {
    render(
      <CategoryPicker options={OPTIONS} value="fruit" onChange={() => {}} />,
    );
    expect(screen.getByText("Food / Fruit")).toBeInTheDocument();
  });

  it("drills into a branch and selects a leaf, calling onChange with id + path", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategoryPicker options={OPTIONS} value={null} onChange={onChange} />,
    );
    await user.click(screen.getByRole("button", { name: /Select category/ }));
    await user.click(screen.getByRole("menuitem", { name: /Food/ }));
    await user.click(screen.getByRole("menuitem", { name: /Fruit/ }));
    expect(onChange).toHaveBeenCalledWith(
      "fruit",
      expect.arrayContaining([
        expect.objectContaining({ id: "food" }),
        expect.objectContaining({ id: "fruit" }),
      ]),
    );
  });

  it("allowBranchSelection selects branches directly", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategoryPicker
        options={OPTIONS}
        value={null}
        onChange={onChange}
        allowBranchSelection
      />,
    );
    await user.click(screen.getByRole("button", { name: /Select category/ }));
    await user.click(screen.getByRole("menuitem", { name: /Food/ }));
    expect(onChange).toHaveBeenCalledWith("food", expect.any(Array));
  });

  it("disabled prevents interaction", async () => {
    const user = userEvent.setup();
    render(
      <CategoryPicker
        options={OPTIONS}
        value={null}
        onChange={() => {}}
        disabled
      />,
    );
    await user.click(screen.getByRole("button", { name: /Select category/ }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <CategoryPicker options={OPTIONS} value={null} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
