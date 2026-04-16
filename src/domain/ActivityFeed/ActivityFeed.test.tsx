import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ActivityFeed } from "./ActivityFeed";

const ITEMS = [
  {
    id: "1",
    actor: { name: "Jane" },
    action: "edited",
    timestamp: new Date(),
  },
];

describe("ActivityFeed", () => {
  it("renders items", () => {
    render(<ActivityFeed items={ITEMS} />);
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("renders empty message", () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });

  it("fires onLoadMore", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ActivityFeed items={ITEMS} hasMore onLoadMore={fn} />);
    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(<ActivityFeed items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
