import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { WorkflowStepIndicator } from "./WorkflowStepIndicator";

const STEPS = [
  { id: "a", label: "Start" },
  { id: "b", label: "Review" },
  { id: "c", label: "Ship" },
];

describe("WorkflowStepIndicator", () => {
  it("marks current step", () => {
    render(<WorkflowStepIndicator steps={STEPS} currentStep="b" />);
    const current = screen.getByText("Review").closest("li");
    expect(current).toHaveAttribute("aria-current", "step");
    expect(current).toHaveClass("ui-workflow-step-indicator__step--current");
  });

  it("marks completed steps", () => {
    render(<WorkflowStepIndicator steps={STEPS} currentStep="c" />);
    const done = screen.getByText("Start").closest("li");
    expect(done).toHaveClass("ui-workflow-step-indicator__step--completed");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <WorkflowStepIndicator steps={STEPS} currentStep="a" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
