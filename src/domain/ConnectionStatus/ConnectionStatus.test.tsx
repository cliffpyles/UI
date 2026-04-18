import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { ConnectionStatus } from "./ConnectionStatus";

describe("ConnectionStatus", () => {
  it("renders live state via LiveIndicator", () => {
    const { container } = render(<ConnectionStatus state="live" />);
    expect(container.querySelector(".ui-live-indicator")).toBeTruthy();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders reconnecting state", () => {
    const { container } = render(<ConnectionStatus state="reconnecting" />);
    expect(container.querySelector(".ui-live-indicator")).toBeTruthy();
    expect(screen.getAllByText("Reconnecting…").length).toBeGreaterThan(0);
  });

  it("renders offline with wifi-off icon", () => {
    const { container } = render(<ConnectionStatus state="offline" />);
    expect(container.querySelector(".ui-icon")).toBeTruthy();
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("omits timestamp when lastUpdated is null", () => {
    const { container } = render(
      <ConnectionStatus state="offline" lastUpdated={null} />,
    );
    expect(container.querySelector(".ui-connection-status__meta")).toBeNull();
  });

  it("renders timestamp when lastUpdated provided", () => {
    const { container } = render(
      <ConnectionStatus state="offline" lastUpdated={new Date()} />,
    );
    expect(container.querySelector(".ui-connection-status__meta")).toBeTruthy();
  });

  it("respects label override", () => {
    render(<ConnectionStatus state="offline" label="Disconnected" />);
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("root has aria-live polite", () => {
    render(<ConnectionStatus state="live" data-testid="root" />);
    expect(screen.getByTestId("root")).toHaveAttribute("aria-live", "polite");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ConnectionStatus ref={ref} state="live" className="x" data-testid="c" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("c")).toHaveClass("ui-connection-status", "x");
  });

  it("no a11y violations (live)", async () => {
    const { container } = render(<ConnectionStatus state="live" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("no a11y violations (offline)", async () => {
    const { container } = render(
      <ConnectionStatus state="offline" lastUpdated={new Date()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
