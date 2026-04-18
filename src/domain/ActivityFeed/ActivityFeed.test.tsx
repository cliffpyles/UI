import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ActivityFeed, type ActivityEvent } from "./ActivityFeed";

const TODAY_EVENT: ActivityEvent = {
  id: "1",
  occurredAt: new Date(),
  actor: { name: "Jane" },
  action: "edited",
};

describe("ActivityFeed", () => {
  it("renders events grouped under a day heading", () => {
    render(<ActivityFeed events={[TODAY_EVENT]} />);
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Today" }),
    ).toBeInTheDocument();
  });

  it("renders an EmptyState when there are no events", () => {
    render(<ActivityFeed events={[]} emptyTitle="No activity yet" />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });

  it("exposes role=feed and aria-busy while loading", () => {
    const { container } = render(<ActivityFeed events={[TODAY_EVENT]} loading />);
    const feed = container.querySelector('[role="feed"]');
    expect(feed).not.toBeNull();
    expect(feed).toHaveAttribute("aria-busy", "true");
  });

  it("invokes loadMore when the Load more button is clicked", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ActivityFeed events={[TODAY_EVENT]} loadMore={fn} />);
    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(fn).toHaveBeenCalled();
  });

  it("renders Pagination when totalCount + pageSize + onPageChange are provided", () => {
    render(
      <ActivityFeed
        events={[TODAY_EVENT]}
        page={1}
        pageSize={10}
        totalCount={40}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ActivityFeed events={[TODAY_EVENT]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
