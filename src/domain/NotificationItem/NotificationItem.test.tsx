import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { NotificationItem } from "./NotificationItem";

const base = {
  id: "1",
  title: "You got a mention",
  body: "in #general",
  timestamp: new Date(Date.now() - 60_000),
};

describe("NotificationItem", () => {
  it("renders title and body", () => {
    render(<NotificationItem notification={base} />);
    expect(screen.getByText("You got a mention")).toBeInTheDocument();
    expect(screen.getByText("in #general")).toBeInTheDocument();
  });

  it("marks unread with dot", () => {
    render(<NotificationItem notification={{ ...base, read: false }} />);
    expect(screen.getByLabelText("Unread")).toBeInTheDocument();
  });

  it("fires onRead and onActivate on click", async () => {
    const user = userEvent.setup();
    const onRead = vi.fn();
    const onActivate = vi.fn();
    render(
      <NotificationItem
        notification={{ ...base, read: false }}
        onRead={onRead}
        onActivate={onActivate}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(onRead).toHaveBeenCalledWith("1");
    expect(onActivate).toHaveBeenCalledWith("1");
  });

  it("activates on Enter key", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<NotificationItem notification={base} onActivate={onActivate} />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onActivate).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <NotificationItem
        ref={ref}
        notification={base}
        className="x"
        data-testid="n"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("n")).toHaveClass("ui-notification-item", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<NotificationItem notification={base} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
