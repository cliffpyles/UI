import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DueDateIndicator } from "./DueDateIndicator";

const NOW = new Date("2026-04-16T12:00:00Z");
const day = 86_400_000;

describe("DueDateIndicator", () => {
  it("renders em-dash and 'No due date' tooltip when date is null", async () => {
    render(<DueDateIndicator date={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
    fireEvent.focus(screen.getByText("\u2014"));
    expect(await screen.findByText("No due date")).toBeInTheDocument();
  });

  it("derives overdue from a past date when status omitted", () => {
    const past = new Date(NOW.getTime() - day);
    render(<DueDateIndicator date={past} now={NOW} data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveClass(
      "ui-due-date-indicator--overdue",
    );
  });

  it("derives due-soon for dates within 3 days", () => {
    const soon = new Date(NOW.getTime() + 2 * day);
    render(<DueDateIndicator date={soon} now={NOW} data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveClass(
      "ui-due-date-indicator--due-soon",
    );
  });

  it("derives ontime for dates well in the future", () => {
    const later = new Date(NOW.getTime() + 30 * day);
    render(<DueDateIndicator date={later} now={NOW} data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveClass(
      "ui-due-date-indicator--ontime",
    );
  });

  it("`completed` overrides status visuals to complete", () => {
    const past = new Date(NOW.getTime() - day);
    render(
      <DueDateIndicator
        date={past}
        now={NOW}
        completed
        data-testid="d"
      />,
    );
    const el = screen.getByTestId("d");
    expect(el).toHaveClass("ui-due-date-indicator--complete");
    expect(el).not.toHaveClass("ui-due-date-indicator--overdue");
  });

  it("explicit status prop wins over derivation", () => {
    const future = new Date(NOW.getTime() + 30 * day);
    render(
      <DueDateIndicator
        date={future}
        now={NOW}
        status="overdue"
        data-testid="d"
      />,
    );
    expect(screen.getByTestId("d")).toHaveClass(
      "ui-due-date-indicator--overdue",
    );
  });

  it("renders a <time> element with ISO datetime", () => {
    const d = new Date(NOW.getTime() + day);
    const { container } = render(<DueDateIndicator date={d} now={NOW} />);
    const time = container.querySelector("time");
    expect(time).not.toBeNull();
    expect(time?.getAttribute("datetime")).toBe(d.toISOString());
  });

  it("tooltip exposes the absolute date on focus", async () => {
    const d = new Date("2026-04-20T15:00:00Z");
    render(<DueDateIndicator date={d} now={NOW} />);
    const time = document.querySelector("time")!;
    fireEvent.focus(time);
    expect(
      await screen.findByText(/2026/),
    ).toBeInTheDocument();
  });

  it("forwards ref to root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<DueDateIndicator ref={ref} date={NOW} now={NOW} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("spreads remaining props onto root", () => {
    render(<DueDateIndicator date={NOW} now={NOW} data-testid="x" />);
    expect(screen.getByTestId("x")).toBeInTheDocument();
  });

  it("composes Icon", () => {
    const { container } = render(
      <DueDateIndicator date={NOW} now={NOW} />,
    );
    expect(container.querySelector(".ui-icon")).not.toBeNull();
  });

  it.each(["ontime", "due-soon", "overdue", "complete"] as const)(
    "axe passes for status=%s",
    async (status) => {
      const { container } = render(
        <DueDateIndicator date={NOW} now={NOW} status={status} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  it("axe passes for null date", async () => {
    const { container } = render(<DueDateIndicator date={null} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
