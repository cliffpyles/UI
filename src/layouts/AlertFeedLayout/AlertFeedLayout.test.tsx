import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AlertFeedLayout, type Alert } from "./AlertFeedLayout";

const alerts: Alert[] = [
  {
    id: "a1",
    severity: "critical",
    title: "DB down",
    timestamp: "10:00",
    content: "Connection failed",
  },
  {
    id: "a2",
    severity: "warning",
    title: "Latency high",
    timestamp: "10:05",
    content: "p99 > 2s",
  },
  {
    id: "a3",
    severity: "info",
    title: "Deploy complete",
    timestamp: "10:10",
    content: "v1.2.3",
    acknowledged: true,
  },
];

describe("AlertFeedLayout", () => {
  it("renders alerts with severity badges", () => {
    render(<AlertFeedLayout alerts={alerts} />);
    expect(screen.getByRole("region", { name: "Alert feed" })).toBeInTheDocument();
    expect(screen.getByText("DB down")).toBeInTheDocument();
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("filters by severityFilter", () => {
    render(<AlertFeedLayout alerts={alerts} severityFilter={["critical"]} />);
    expect(screen.getByText("DB down")).toBeInTheDocument();
    expect(screen.queryByText("Latency high")).not.toBeInTheDocument();
  });

  it("renders toolbar slot", () => {
    render(
      <AlertFeedLayout alerts={alerts} toolbar={<button>Clear</button>} />,
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("calls onAcknowledge with alert id", async () => {
    const onAcknowledge = vi.fn();
    render(<AlertFeedLayout alerts={alerts} onAcknowledge={onAcknowledge} />);
    const buttons = screen.getAllByRole("button", { name: "Acknowledge" });
    await userEvent.click(buttons[0]);
    expect(onAcknowledge).toHaveBeenCalledWith("a1");
  });

  it("disables ack button when acknowledged", () => {
    render(<AlertFeedLayout alerts={alerts} onAcknowledge={() => {}} />);
    expect(screen.getByRole("button", { name: "Acknowledged" })).toBeDisabled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <AlertFeedLayout alerts={alerts} ref={ref} className="custom" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("ui-alert-feed", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AlertFeedLayout alerts={alerts} onAcknowledge={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
