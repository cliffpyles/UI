import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "../../components/Button";
import { BulkActionBar } from "./BulkActionBar";

describe("BulkActionBar", () => {
  it("renders count via formatNumber", () => {
    render(
      <BulkActionBar
        selectedCount={1234}
        onClearSelection={() => {}}
        actions={<Button size="sm">Archive</Button>}
      />,
    );
    expect(screen.getByText("1,234 selected")).toBeInTheDocument();
  });

  it("switches copy to 'N of M selected' when totalCount is set", () => {
    render(
      <BulkActionBar
        selectedCount={3}
        totalCount={20}
        onClearSelection={() => {}}
      />,
    );
    expect(screen.getByText("3 of 20 selected")).toBeInTheDocument();
  });

  it("renders nothing when selectedCount is 0", () => {
    const { container } = render(
      <BulkActionBar selectedCount={0} onClearSelection={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("fires onClearSelection when the clear Button is clicked", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<BulkActionBar selectedCount={1} onClearSelection={fn} />);
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(fn).toHaveBeenCalled();
  });

  it("renders ReactNode actions slot", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <BulkActionBar
        selectedCount={1}
        onClearSelection={() => {}}
        actions={
          <Button size="sm" onClick={fn}>
            Archive
          </Button>
        }
      />,
    );
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(fn).toHaveBeenCalled();
  });

  it("sticky={false} drops the sticky class", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={1}
        onClearSelection={() => {}}
        sticky={false}
      />,
    );
    expect(
      container.querySelector(".ui-bulk-action-bar--sticky"),
    ).toBeNull();
  });

  it("accepts legacy BulkAction[] array and fires onSelect", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <BulkActionBar
        selectedCount={1}
        onClear={() => {}}
        actions={[{ id: "a", label: "Archive", onSelect: fn }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(fn).toHaveBeenCalled();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        totalCount={10}
        onClearSelection={() => {}}
        actions={<Button size="sm">Archive</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
