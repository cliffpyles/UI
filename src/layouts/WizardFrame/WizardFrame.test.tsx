import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { WizardFrame, type WizardStep } from "./WizardFrame";

const steps: WizardStep[] = [
  { id: "account", label: "Account" },
  { id: "profile", label: "Profile", description: "Optional info", optional: true },
  { id: "review", label: "Review" },
];

describe("WizardFrame", () => {
  it("renders step indicator with current step", () => {
    render(
      <WizardFrame steps={steps} currentStep={1}>
        <WizardFrame.StepIndicator />
        <WizardFrame.Content>step 2</WizardFrame.Content>
      </WizardFrame>,
    );
    const list = screen.getByRole("list", { name: /wizard progress/i });
    expect(list).toBeInTheDocument();
    const current = screen.getByText("Profile").closest("li");
    expect(current).toHaveAttribute("aria-current", "step");
  });

  it("marks completed steps", () => {
    render(
      <WizardFrame steps={steps} currentStep={2} completedSteps={[0, 1]}>
        <WizardFrame.StepIndicator />
      </WizardFrame>,
    );
    expect(
      screen.getByText("Account").closest("li"),
    ).toHaveClass("ui-wizard-frame__step--done");
  });

  it("renders content slot", () => {
    render(
      <WizardFrame steps={steps} currentStep={0}>
        <WizardFrame.Content>content</WizardFrame.Content>
      </WizardFrame>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders footer slot", () => {
    render(
      <WizardFrame steps={steps} currentStep={0}>
        <WizardFrame.Footer>
          <button>Next</button>
        </WizardFrame.Footer>
      </WizardFrame>,
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("shows optional label", () => {
    render(
      <WizardFrame steps={steps} currentStep={0}>
        <WizardFrame.StepIndicator />
      </WizardFrame>,
    );
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <WizardFrame steps={steps} currentStep={0}>
        <WizardFrame.StepIndicator />
        <WizardFrame.Content>body</WizardFrame.Content>
        <WizardFrame.Footer>
          <button>Next</button>
        </WizardFrame.Footer>
      </WizardFrame>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
