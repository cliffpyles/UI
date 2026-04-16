import { forwardRef, type HTMLAttributes } from "react";
import { Icon } from "../../primitives/Icon";
import "./WorkflowStepIndicator.css";

export interface StepDef {
  id: string;
  label: string;
  description?: string;
}

export type StepState = "completed" | "current" | "pending";

export interface WorkflowStepIndicatorProps
  extends HTMLAttributes<HTMLOListElement> {
  steps: StepDef[];
  currentStep: string;
  orientation?: "horizontal" | "vertical";
}

function stateForIndex(
  stepIdx: number,
  currentIdx: number,
): StepState {
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "current";
  return "pending";
}

export const WorkflowStepIndicator = forwardRef<HTMLOListElement, WorkflowStepIndicatorProps>(
  function WorkflowStepIndicator(
    { steps, currentStep, orientation = "horizontal", className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-workflow-step-indicator",
      `ui-workflow-step-indicator--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const currentIdx = steps.findIndex((s) => s.id === currentStep);

    return (
      <ol ref={ref} className={classes} aria-label="Workflow steps" {...rest}>
        {steps.map((step, i) => {
          const state = stateForIndex(i, currentIdx);
          return (
            <li
              key={step.id}
              className={`ui-workflow-step-indicator__step ui-workflow-step-indicator__step--${state}`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="ui-workflow-step-indicator__marker" aria-hidden="true">
                {state === "completed" ? (
                  <Icon name="info" size="xs" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="ui-workflow-step-indicator__label">{step.label}</span>
              {step.description && (
                <span className="ui-workflow-step-indicator__description">
                  {step.description}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);
