import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CommandPalette, type CommandItem } from "./CommandPalette";

const items: CommandItem[] = [
  { id: "new", label: "New File", category: "File", shortcut: "⌘N" },
  { id: "open", label: "Open File", category: "File" },
  { id: "save", label: "Save", category: "File", disabled: true },
  { id: "settings", label: "Open Settings", category: "App" },
];

describe("CommandPalette", () => {
  it("does not render when closed", () => {
    render(<CommandPalette open={false} onClose={() => {}} items={items} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a dialog with listbox when open", () => {
    render(<CommandPalette open onClose={() => {}} items={items} />);
    expect(screen.getByRole("dialog", { name: /command palette/i })).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters items by fuzzy query", async () => {
    render(<CommandPalette open onClose={() => {}} items={items} />);
    await userEvent.type(screen.getByRole("combobox"), "stg");
    expect(screen.getByText("Open Settings")).toBeInTheDocument();
    expect(screen.queryByText("New File")).not.toBeInTheDocument();
  });

  it("shows empty message when no results", async () => {
    render(<CommandPalette open onClose={() => {}} items={items} />);
    await userEvent.type(screen.getByRole("combobox"), "zzzz");
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("navigates with arrow keys and selects with Enter", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <CommandPalette open onClose={onClose} items={items} onSelect={onSelect} />,
    );
    const input = screen.getByRole("combobox");
    input.focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "open" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} items={items} />);
    screen.getByRole("combobox").focus();
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("shows Recent group when recentIds provided and query empty", () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items}
        recentIds={["settings"]}
      />,
    );
    expect(screen.getByText("Recent")).toBeInTheDocument();
  });

  it("ignores disabled items on click", async () => {
    const onSelect = vi.fn();
    render(<CommandPalette open onClose={() => {}} items={items} onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Save"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <CommandPalette open onClose={() => {}} items={items} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
