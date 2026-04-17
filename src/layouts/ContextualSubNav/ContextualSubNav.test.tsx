import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ContextualSubNav } from "./ContextualSubNav";

const items = [
  { id: "overview", label: "Overview", active: true },
  { id: "members", label: "Members", badge: 12 },
  { id: "settings", label: "Settings" },
  { id: "archived", label: "Archived", disabled: true },
];

describe("ContextualSubNav", () => {
  it("renders a nav landmark with items", () => {
    render(<ContextualSubNav items={items} />);
    expect(screen.getByRole("navigation", { name: "Section" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("marks active item with aria-current", () => {
    render(<ContextualSubNav items={items} />);
    expect(screen.getByRole("button", { name: /Overview/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("invokes onClick for non-disabled items", async () => {
    const onClick = vi.fn();
    render(<ContextualSubNav items={[{ id: "a", label: "A", onClick }]} />);
    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("disables items when disabled", () => {
    render(<ContextualSubNav items={items} />);
    expect(screen.getByRole("button", { name: /Archived/i })).toBeDisabled();
  });

  it("renders actions slot", () => {
    render(<ContextualSubNav items={items} actions={<button>New</button>} />);
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("renders anchor when href provided", () => {
    render(<ContextualSubNav items={[{ id: "a", label: "A", href: "/a" }]} />);
    expect(screen.getByRole("link", { name: "A" })).toHaveAttribute("href", "/a");
  });

  it("renders badge", () => {
    render(<ContextualSubNav items={items} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ContextualSubNav items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
