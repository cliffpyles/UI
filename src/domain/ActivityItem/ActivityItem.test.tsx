import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ActivityItem } from "./ActivityItem";

describe("ActivityItem", () => {
  it("renders actor, action, target, and timestamp", () => {
    render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="commented on"
        target="Project X"
        occurredAt={new Date()}
      />,
    );
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText(/commented on/)).toBeInTheDocument();
    expect(screen.getByText(/Project X/)).toBeInTheDocument();
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("omits target cleanly when not provided", () => {
    render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="signed in"
        occurredAt={new Date()}
      />,
    );
    expect(screen.queryByText("Project X")).not.toBeInTheDocument();
  });

  it("renders actions and fires onSelect when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="opened"
        occurredAt={new Date()}
        actions={[{ label: "Undo", onSelect }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("composes UserChip, Text, Timestamp", () => {
    const { container } = render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="did something"
        occurredAt={new Date()}
      />,
    );
    expect(container.querySelector(".ui-user-chip")).not.toBeNull();
    expect(container.querySelector(".ui-timestamp")).not.toBeNull();
    expect(container.querySelector(".ui-text")).not.toBeNull();
  });

  it("forwards ref and spreads props to root article", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <ActivityItem
        ref={ref}
        actor={{ name: "Jane" }}
        action="did something"
        occurredAt={new Date()}
        data-testid="feed-item"
      />,
    );
    expect(ref.current?.tagName).toBe("ARTICLE");
    expect(screen.getByTestId("feed-item")).toBe(ref.current);
  });

  it("has no a11y violations (default, no-target, with-actions)", async () => {
    const cases = [
      <ActivityItem
        key="default"
        actor={{ name: "Jane" }}
        action="commented on"
        target="Project X"
        occurredAt={new Date()}
      />,
      <ActivityItem
        key="no-target"
        actor={{ name: "Jane" }}
        action="signed in"
        occurredAt={new Date()}
      />,
      <ActivityItem
        key="with-actions"
        actor={{ name: "Jane" }}
        action="opened"
        occurredAt={new Date()}
        actions={[{ label: "Undo", onSelect: () => {} }]}
      />,
    ];
    for (const c of cases) {
      const { container, unmount } = render(c);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
