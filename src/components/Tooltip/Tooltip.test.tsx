import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not show tooltip by default", () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // --- Hover ---

  it("shows tooltip on hover after delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip text" delay={500}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button"));
    // Before delay
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    // Advance past delay
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tip text");
  });

  it("hides tooltip on mouse leave", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button"));
    act(() => vi.runAllTimers());
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.unhover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // --- Focus ---

  it("shows tooltip on focus (no delay for keyboard)", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Focus tip" delay={500}>
        <button>Focus me</button>
      </Tooltip>,
    );
    await user.tab();
    // Should show immediately, no need to advance timers
    expect(screen.getByRole("tooltip")).toHaveTextContent("Focus tip");
  });

  it("hides tooltip on blur", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <Tooltip content="Tip">
          <button>Focus me</button>
        </Tooltip>
        <button>Other</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // --- Escape ---

  it("dismisses on Escape key", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip">
        <button>Focus me</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // --- ARIA ---

  it("has role='tooltip' and aria-describedby on trigger wrapper", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Described">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    // aria-describedby is on the wrapper span, not the button itself
    const triggerWrapper = tooltip.previousElementSibling!;
    expect(triggerWrapper).toHaveAttribute("aria-describedby", tooltip.id);
  });

  // --- Custom delay ---

  it("respects custom delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" delay={200}>
        <button>Hover</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(100));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  // --- Side ---

  it("applies side class", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" side="bottom">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveClass("ui-tooltip--bottom");
  });

  // --- Max width ---

  it("applies maxWidth style", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Tooltip content="Tip" maxWidth={300}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveStyle({ maxWidth: "300px" });
  });

  // --- Accessibility ---

  it("has no accessibility violations when hidden", async () => {
    const { container } = render(
      <Tooltip content="Tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when visible", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(
      <Tooltip content="Tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await axe(container)).toHaveNoViolations();
  });
});
