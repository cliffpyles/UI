import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ValueChangeIndicator } from "./ValueChangeIndicator";

describe("ValueChangeIndicator", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders children", () => {
    render(<ValueChangeIndicator value={1}>42</ValueChangeIndicator>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("applies highlight class when value changes", async () => {
    vi.useFakeTimers();
    const { rerender, container } = render(
      <ValueChangeIndicator value={1}>1</ValueChangeIndicator>,
    );
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });
    rerender(<ValueChangeIndicator value={2}>2</ValueChangeIndicator>);
    expect(container.querySelector(".ui-value-change--highlight")).toBeTruthy();
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(container.querySelector(".ui-value-change--highlight")).toBeFalsy();
  });

  it("shows direction arrow for numeric increase", async () => {
    vi.useFakeTimers();
    const { rerender, container } = render(
      <ValueChangeIndicator value={1} direction>1</ValueChangeIndicator>,
    );
    await act(async () => { vi.advanceTimersByTime(1200); });
    rerender(<ValueChangeIndicator value={5} direction>5</ValueChangeIndicator>);
    expect(container.querySelector(".ui-value-change--up")).toBeTruthy();
    expect(screen.getByText("▲")).toBeInTheDocument();
  });

  it("shows direction arrow for numeric decrease", async () => {
    vi.useFakeTimers();
    const { rerender, container } = render(
      <ValueChangeIndicator value={5} direction>5</ValueChangeIndicator>,
    );
    await act(async () => { vi.advanceTimersByTime(1200); });
    rerender(<ValueChangeIndicator value={1} direction>1</ValueChangeIndicator>);
    expect(container.querySelector(".ui-value-change--down")).toBeTruthy();
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("rate-limits highlight at high frequency", async () => {
    vi.useFakeTimers();
    const { rerender, container } = render(
      <ValueChangeIndicator value={1} rateLimitMs={1000}>1</ValueChangeIndicator>,
    );
    await act(async () => { vi.advanceTimersByTime(1200); });
    rerender(<ValueChangeIndicator value={2} rateLimitMs={1000}>2</ValueChangeIndicator>);
    expect(container.querySelector(".ui-value-change--highlight")).toBeTruthy();
    await act(async () => { vi.advanceTimersByTime(100); });
    rerender(<ValueChangeIndicator value={3} rateLimitMs={1000}>3</ValueChangeIndicator>);
    // second change was within rate limit — highlight should be removed (not re-triggered)
    await act(async () => { vi.advanceTimersByTime(1500); });
    expect(container.querySelector(".ui-value-change--highlight")).toBeFalsy();
  });

  it("forwards ref and merges className", () => {
    const ref = { current: null as HTMLSpanElement | null };
    const { container } = render(
      <ValueChangeIndicator value={1} ref={ref} className="extra">1</ValueChangeIndicator>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(container.querySelector(".ui-value-change.extra")).toBeTruthy();
  });

  it("is accessible", async () => {
    const { container } = render(<ValueChangeIndicator value={1} direction>42</ValueChangeIndicator>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
