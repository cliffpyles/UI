import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SavedViewsLayout } from "./SavedViewsLayout";

const views = [
  { id: "1", name: "Open bugs", description: "All P0 and P1" },
  { id: "2", name: "My team" },
];

describe("SavedViewsLayout", () => {
  it("renders default list of views", () => {
    render(<SavedViewsLayout views={views} />);
    expect(screen.getByRole("list", { name: "Saved views" })).toBeInTheDocument();
    expect(screen.getByText("Open bugs")).toBeInTheDocument();
    expect(screen.getByText("All P0 and P1")).toBeInTheDocument();
    expect(screen.getByText("My team")).toBeInTheDocument();
  });

  it("calls onSelectView when a view is clicked", async () => {
    const onSelectView = vi.fn();
    render(<SavedViewsLayout views={views} onSelectView={onSelectView} />);
    await userEvent.click(screen.getByText("Open bugs"));
    expect(onSelectView).toHaveBeenCalledWith(views[0]);
  });

  it("uses custom renderView when provided", () => {
    render(
      <SavedViewsLayout
        views={views}
        renderView={(v) => <span>Custom:{v.name}</span>}
      />,
    );
    expect(screen.getByText("Custom:Open bugs")).toBeInTheDocument();
  });

  it("calls onCreate when create button clicked", async () => {
    const onCreate = vi.fn();
    render(<SavedViewsLayout views={views} onCreate={onCreate} />);
    await userEvent.click(screen.getByRole("button", { name: "New view" }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("renders empty state when no views", () => {
    render(<SavedViewsLayout views={[]} empty={<p>no views</p>} />);
    expect(screen.getByText("no views")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("applies grid modifier", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SavedViewsLayout ref={ref} views={views} view="grid" />);
    expect(ref.current?.className).toContain("ui-saved-views--grid");
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SavedViewsLayout ref={ref} className="extra" views={views} />);
    expect(ref.current?.className).toContain("ui-saved-views");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SavedViewsLayout views={views} onCreate={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
