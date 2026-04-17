import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CollapsibleSidebarNav, type SidebarNavItem } from "./CollapsibleSidebarNav";

const items: SidebarNavItem[] = [
  { id: "home", label: "Home", icon: "search", href: "/" },
  {
    id: "projects",
    label: "Projects",
    icon: "filter",
    children: [
      { id: "alpha", label: "Alpha", href: "/alpha" },
      { id: "beta", label: "Beta", href: "/beta" },
    ],
  },
  { id: "settings", label: "Settings", icon: "settings", active: true },
];

describe("CollapsibleSidebarNav", () => {
  it("renders a nav landmark with items", () => {
    render(<CollapsibleSidebarNav items={items} />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("marks active item with aria-current", () => {
    render(<CollapsibleSidebarNav items={items} />);
    const active = screen.getByRole("button", { name: /Settings/i });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("expands children when clicking a group", async () => {
    render(<CollapsibleSidebarNav items={items} />);
    const group = screen.getByRole("button", { name: /Projects/i });
    expect(group).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(group);
    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("invokes collapse toggle", async () => {
    const onCollapsedChange = vi.fn();
    render(
      <CollapsibleSidebarNav items={items} onCollapsedChange={onCollapsedChange} />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    );
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("hides labels when collapsed", () => {
    render(<CollapsibleSidebarNav items={items} collapsed />);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("renders pinned items separately", () => {
    render(
      <CollapsibleSidebarNav
        items={[{ id: "p", label: "Pinned", pinned: true }, ...items]}
      />,
    );
    expect(screen.getByText("Pinned")).toBeInTheDocument();
  });

  it("renders header and footer", () => {
    render(
      <CollapsibleSidebarNav
        items={items}
        header={<span>Logo</span>}
        footer={<span>User</span>}
      />,
    );
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<CollapsibleSidebarNav items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
