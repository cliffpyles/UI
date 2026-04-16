import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { BulkActionBar } from "./BulkActionBar";

describe("BulkActionBar", () => {
  it("renders count with pluralization", () => {
    render(
      <BulkActionBar
        selectedCount={3}
        actions={[{ id: "a", label: "Archive", onSelect: () => {} }]}
        onClear={() => {}}
      />,
    );
    expect(screen.getByText("3 rows selected")).toBeInTheDocument();
  });

  it("hides when count is 0", () => {
    const { container } = render(
      <BulkActionBar selectedCount={0} actions={[]} onClear={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("fires action", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <BulkActionBar
        selectedCount={1}
        actions={[{ id: "a", label: "Archive", onSelect: fn }]}
        onClear={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(fn).toHaveBeenCalled();
  });

  it("fires clear", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<BulkActionBar selectedCount={1} actions={[]} onClear={fn} />);
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ id: "a", label: "Archive", onSelect: () => {} }]}
        onClear={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
