import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Menu } from "./Menu";

function renderMenu({
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
    <Menu>
      <Menu.Trigger>Options</Menu.Trigger>
      <Menu.List>
        <Menu.Item onSelect={onEdit}>Edit</Menu.Item>
        <Menu.Item onSelect={onDuplicate} disabled={disabledItems}>
          Duplicate
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={onDelete}>Delete</Menu.Item>
      </Menu.List>
    </Menu>,
  );
}

describe("Menu", () => {
  it("opens on trigger click", async () => {
    renderMenu();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on second trigger click", async () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to trigger", async () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("cycles focus with ArrowDown/ArrowUp", async () => {
    renderMenu();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(document.activeElement).toHaveTextContent("Edit");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Duplicate");
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Edit");
    // wrap up from first
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  it("Home/End jump to first/last", async () => {
    renderMenu();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("Delete");
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("Enter selects the focused item", async () => {
    const onEdit = vi.fn();
    renderMenu({ onEdit });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("skips disabled items during keyboard navigation", async () => {
    renderMenu({ disabledItems: true });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(document.activeElement).toHaveTextContent("Edit");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  it("does not fire onSelect for disabled items on click", async () => {
    const onDuplicate = vi.fn();
    renderMenu({ onDuplicate, disabledItems: true });
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(onDuplicate).not.toHaveBeenCalled();
  });

  it("closes on outside click", async () => {
    renderMenu();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("forwards ref to the list element", async () => {
    const listRef = createRef<HTMLDivElement>();
    render(
      <Menu defaultOpen>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.List ref={listRef}>
          <Menu.Item>Only</Menu.Item>
        </Menu.List>
      </Menu>,
    );
    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(listRef.current?.getAttribute("role")).toBe("menu");
  });

  it("merges className on the list", async () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.List className="custom-list">
          <Menu.Item>Only</Menu.Item>
        </Menu.List>
      </Menu>,
    );
    expect(screen.getByRole("menu")).toHaveClass("ui-menu__list", "custom-list");
  });

  it("sets aria-haspopup and toggles aria-expanded", async () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("supports asChild Trigger", async () => {
    render(
      <Menu>
        <Menu.Trigger asChild>
          <a href="#nowhere">Open</a>
        </Menu.Trigger>
        <Menu.List>
          <Menu.Item>Only</Menu.Item>
        </Menu.List>
      </Menu>,
    );
    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("aria-haspopup", "menu");
    await userEvent.click(link);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = renderMenu();
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
