import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MultiStepFormLayout, type FormStep } from "./MultiStepFormLayout";

const steps: FormStep[] = [
  { id: "a", label: "Account", content: <div>account body</div> },
  { id: "p", label: "Profile", content: <div>profile body</div> },
  { id: "r", label: "Review", content: <div>review body</div> },
];

describe("MultiStepFormLayout", () => {
  it("renders progress and current step content", () => {
    render(<MultiStepFormLayout steps={steps} currentStep={1} />);
    expect(screen.getByRole("list", { name: "Form progress" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Profile" })).toHaveTextContent(
      "profile body",
    );
  });

  it("fires onNext when Next clicked", async () => {
    const onNext = vi.fn();
    render(
      <MultiStepFormLayout steps={steps} currentStep={0} onNext={onNext} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalled();
  });

  it("blocks onNext when validator fails", async () => {
    const onNext = vi.fn();
    render(
      <MultiStepFormLayout
        steps={steps}
        currentStep={0}
        onNext={onNext}
        validators={[() => false]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).not.toHaveBeenCalled();
  });

  it("fires onBack when Back clicked", async () => {
    const onBack = vi.fn();
    render(
      <MultiStepFormLayout steps={steps} currentStep={1} onBack={onBack} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalled();
  });

  it("renders custom footer", () => {
    render(
      <MultiStepFormLayout
        steps={steps}
        currentStep={0}
        footer={<button>Custom</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MultiStepFormLayout
        ref={ref}
        className="custom"
        steps={steps}
        currentStep={0}
      />,
    );
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <MultiStepFormLayout steps={steps} currentStep={0} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
