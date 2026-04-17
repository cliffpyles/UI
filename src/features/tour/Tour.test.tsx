import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Tour, type TourStep } from "./Tour";

const steps: TourStep[] = [
  { target: "#a", title: "A title", content: "A content" },
  { target: "#b", title: "B title", content: "B content" },
  { target: "#c", title: "C title", content: "C content" },
];

function setupTargets() {
  const host = document.createElement("div");
  host.id = "targets-host";
  host.innerHTML = '<div id="a">a</div><div id="b">b</div><div id="c">c</div>';
  document.body.appendChild(host);
  return host;
}

describe("Tour", () => {
  beforeEach(() => {
    localStorage.clear();
    setupTargets();
  });

  afterEach(() => {
    cleanup();
    document.getElementById("targets-host")?.remove();
    vi.restoreAllMocks();
  });

  it("renders first step and advances on Next", () => {
    render(<Tour id="t1" steps={steps} persist={false} />);
    expect(screen.getByText("A title")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("B title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
  });

  it("goes back on Previous", () => {
    render(<Tour id="t2" steps={steps} persist={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("A title")).toBeInTheDocument();
  });

  it("fires onComplete after last step", () => {
    const onComplete = vi.fn();
    render(<Tour id="t3" steps={steps} onComplete={onComplete} persist={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Finish" }));
    expect(onComplete).toHaveBeenCalled();
  });

  it("fires onSkip on skip button", () => {
    const onSkip = vi.fn();
    render(<Tour id="t4" steps={steps} onSkip={onSkip} persist={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Skip tour" }));
    expect(onSkip).toHaveBeenCalled();
  });

  it("persists completion", () => {
    const onComplete = vi.fn();
    const { unmount } = render(<Tour id="persisted" steps={[steps[0]]} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: "Finish" }));
    expect(onComplete).toHaveBeenCalled();
    unmount();
    render(<Tour id="persisted" steps={[steps[0]]} />);
    expect(screen.queryByText("A title")).not.toBeInTheDocument();
  });

  it("caps at 7 steps", () => {
    const many: TourStep[] = Array.from({ length: 10 }, (_, i) => ({
      target: "#a",
      title: `T${i}`,
      content: `C${i}`,
    }));
    render(<Tour id="cap" steps={many} persist={false} />);
    expect(screen.getByText("Step 1 of 7")).toBeInTheDocument();
  });

  it("is accessible", async () => {
    render(<Tour id="a11y" steps={steps} persist={false} />);
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    const results = await axe(dialog as Element);
    expect(results).toHaveNoViolations();
  });
});
