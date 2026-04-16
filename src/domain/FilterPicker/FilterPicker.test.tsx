import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FilterPicker } from "./FilterPicker";

const FIELDS = [
  { id: "status", label: "Status", type: "enum" as const, group: "Core" },
  { id: "name", label: "Name", type: "string" as const, group: "Core" },
  { id: "age", label: "Age", type: "number" as const },
];

describe("FilterPicker", () => {
  it("opens panel and lists fields", async () => {
    const user = userEvent.setup();
    render(<FilterPicker fields={FIELDS} onSelect={() => {}} />);
    await user.click(screen.getByRole("button", { name: /Add filter/ }));
    expect(screen.getByRole("option", { name: "Status" })).toBeInTheDocument();
  });

  it("calls onSelect", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<FilterPicker fields={FIELDS} onSelect={fn} />);
    await user.click(screen.getByRole("button", { name: /Add filter/ }));
    await user.click(screen.getByRole("option", { name: "Status" }));
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ id: "status" }));
  });

  it("filters by search query", async () => {
    const user = userEvent.setup();
    render(<FilterPicker fields={FIELDS} onSelect={() => {}} />);
    await user.click(screen.getByRole("button", { name: /Add filter/ }));
    await user.type(screen.getByLabelText("Search fields"), "age");
    expect(screen.getByRole("option", { name: "Age" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Status" })).not.toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<FilterPicker fields={FIELDS} onSelect={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
