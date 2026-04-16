import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { ConnectionStatus } from "./ConnectionStatus";

describe("ConnectionStatus", () => {
  it("renders connected state", () => {
    render(<ConnectionStatus status="connected" />);
    expect(screen.getByText("Connected")).toBeInTheDocument();
  });

  it("uses assertive aria-live when disconnected", () => {
    render(<ConnectionStatus status="disconnected" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "assertive");
  });

  it("invokes onRetry when disconnected", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ConnectionStatus status="disconnected" onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<ConnectionStatus ref={ref} status="connected" className="x" data-testid="c" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("c")).toHaveClass("ui-connection-status", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<ConnectionStatus status="connected" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
