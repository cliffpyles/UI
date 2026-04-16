import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { SyncStatus } from "./SyncStatus";

describe("SyncStatus", () => {
  it("renders synced label", () => {
    render(<SyncStatus status="synced" />);
    expect(screen.getByText("Synced")).toBeInTheDocument();
  });

  it("renders syncing state", () => {
    render(<SyncStatus status="syncing" />);
    expect(screen.getByText("Syncing…")).toBeInTheDocument();
  });

  it("shows retry on error", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<SyncStatus status="error" onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("shows last synced time", () => {
    const d = new Date(Date.now() - 2 * 60_000);
    render(<SyncStatus status="synced" lastSynced={d} locale="en-US" />);
    expect(screen.getByText(/minute/)).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<SyncStatus ref={ref} status="synced" className="x" data-testid="s" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("s")).toHaveClass("ui-sync-status", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<SyncStatus status="synced" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
