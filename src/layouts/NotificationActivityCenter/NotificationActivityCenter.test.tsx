import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { NotificationActivityCenter } from "./NotificationActivityCenter";

const categories = [
  { id: "mentions", label: "Mentions" },
  { id: "tasks", label: "Tasks" },
];

const notifications = [
  { id: "n1", category: "mentions", title: "@you was mentioned", read: false },
  { id: "n2", category: "tasks", title: "Review PR", read: true },
  { id: "n3", category: "mentions", title: "Reply from Sam", read: false },
];

describe("NotificationActivityCenter", () => {
  it("renders heading and list", () => {
    render(<NotificationActivityCenter categories={categories} notifications={notifications} />);
    expect(screen.getByRole("heading", { name: /activity/i })).toBeInTheDocument();
    expect(screen.getByText("@you was mentioned")).toBeInTheDocument();
  });

  it("shows unread count", () => {
    render(<NotificationActivityCenter categories={categories} notifications={notifications} />);
    expect(screen.getByLabelText("2 unread")).toHaveTextContent("2");
  });

  it("filters by category", async () => {
    render(<NotificationActivityCenter categories={categories} notifications={notifications} />);
    await userEvent.click(screen.getByRole("tab", { name: "Tasks" }));
    expect(screen.getByText("Review PR")).toBeInTheDocument();
    expect(screen.queryByText("@you was mentioned")).not.toBeInTheDocument();
  });

  it("invokes onCategoryChange", async () => {
    const onCategoryChange = vi.fn();
    render(
      <NotificationActivityCenter
        categories={categories}
        notifications={notifications}
        onCategoryChange={onCategoryChange}
      />,
    );
    await userEvent.click(screen.getByRole("tab", { name: "Tasks" }));
    expect(onCategoryChange).toHaveBeenCalledWith("tasks");
  });

  it("toggles read state", async () => {
    const onToggleRead = vi.fn();
    render(
      <NotificationActivityCenter
        categories={categories}
        notifications={notifications}
        onToggleRead={onToggleRead}
      />,
    );
    await userEvent.click(screen.getAllByRole("button", { name: /mark read/i })[0]!);
    expect(onToggleRead).toHaveBeenCalledWith("n1", true);
  });

  it("invokes onMarkAllRead", async () => {
    const onMarkAllRead = vi.fn();
    render(
      <NotificationActivityCenter
        categories={categories}
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /mark all as read/i }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it("shows empty message when no notifications", () => {
    render(<NotificationActivityCenter categories={categories} notifications={[]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <NotificationActivityCenter categories={categories} notifications={notifications} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
