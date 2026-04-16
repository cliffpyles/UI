import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Dropdown } from "./Dropdown";

function renderDropdown({
  onEdit = vi.fn(),
  onDuplicate = vi.fn(),
  onDelete = vi.fn(),
  disabledItems = false,
}: {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  disabledItems?: boolean;
} = {}) {
  return render(
    <Dropdown>
      <Dropdown.Trigger>Options</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={onEdit}>Edit</Dropdown.Item>
        <Dropdown.Item onSelect={onDuplicate} disabled={disabledItems}>
          Duplicate
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item onSelect={onDelete} variant="destructive">
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>,
  );
}

describe("Dropdown", () => {
  // --- Opening and closing ---

  it("is closed by default", () => {
    renderDropdown();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on second trigger click", async () => {
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("returns focus to trigger on Escape", async () => {
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on outside click", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    // Click on body (outside)
    await userEvent.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // --- Item selection ---

  it("fires onSelect when item is clicked", async () => {
    const onEdit = vi.fn();
    renderDropdown({ onEdit });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("closes after item selection", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("fires onSelect on Enter key", async () => {
    const onEdit = vi.fn();
    renderDropdown({ onEdit });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    // First item is focused
    await userEvent.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("fires onSelect on Space key", async () => {
    const onEdit = vi.fn();
    renderDropdown({ onEdit });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard(" ");
    expect(onEdit).toHaveBeenCalledOnce();
  });

  // --- Disabled items ---

  it("does not fire onSelect for disabled items", async () => {
    const onDuplicate = vi.fn();
    renderDropdown({ onDuplicate, disabledItems: true });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(onDuplicate).not.toHaveBeenCalled();
  });

  it("skips disabled items during keyboard navigation", async () => {
    renderDropdown({ disabledItems: true });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    // First focused: Edit (first non-disabled item)
    expect(document.activeElement).toHaveTextContent("Edit");
    // ArrowDown should skip Duplicate (disabled) and go to Delete
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  // --- Keyboard navigation ---

  it("focuses first item on open", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("navigates down with ArrowDown", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Duplicate");
  });

  it("navigates up with ArrowUp", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("wraps around from last to first with ArrowDown", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    // Now on Delete (third item), one more should wrap to Edit
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("wraps around from first to last with ArrowUp", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    // Currently on Edit (first), ArrowUp should wrap to Delete (last)
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  it("Home key focuses first item", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("End key focuses last item", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  // --- ARIA attributes ---

  it("trigger has aria-haspopup and aria-expanded", async () => {
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("menu has role menu and aria-labelledby", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-labelledby");
  });

  it("items have role menuitem", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("separator has role separator", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  // --- Destructive variant ---

  it("applies destructive class to destructive items", async () => {
    renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const deleteItem = screen.getByRole("menuitem", { name: "Delete" });
    expect(deleteItem).toHaveClass("ui-dropdown__item--destructive");
  });

  // --- Accessibility ---

  it("has no accessibility violations when closed", async () => {
    const { container } = renderDropdown();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = renderDropdown();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
