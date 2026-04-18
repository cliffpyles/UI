import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import "./MultiStepFormLayout.css";

export interface FormStep {
  id: string;
  label: string;
  content: ReactNode;
}

export interface MultiStepFormLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  steps: FormStep[];
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  onStepChange?: (idx: number) => void;
  validators?: ((stepIdx: number) => boolean)[];
  footer?: ReactNode;
}

export const MultiStepFormLayout = forwardRef<
  HTMLDivElement,
  MultiStepFormLayoutProps
>(function MultiStepFormLayout(
  {
    steps,
    currentStep,
    onNext,
    onBack,
    onStepChange,
    validators,
    footer,
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-multi-step-form", className].filter(Boolean).join(" ");
  const current = steps[currentStep];
  const total = steps.length;

  const canAdvance = () => {
    const v = validators?.[currentStep];
    return v ? v(currentStep) : true;
  };

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= total) return;
    onStepChange?.(idx);
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    onNext?.();
  };

  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      display="flex"
      direction="column"
      gap="section"
      padding="page"
      className={classes}
      {...rest}
    >
      <ol
        className="ui-multi-step-form__progress"
        aria-label="Form progress"
      >
        {steps.map((s, idx) => {
          const active = idx === currentStep;
          const done = idx < currentStep;
          return (
            <li
              key={s.id}
              className={[
                "ui-multi-step-form__step",
                active && "ui-multi-step-form__step--active",
                done && "ui-multi-step-form__step--done",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={active ? "step" : undefined}
            >
              <Button
                variant="ghost"
                size="sm"
                className="ui-multi-step-form__step-button"
                onClick={() => goTo(idx)}
                disabled={idx > currentStep}
              >
                <Box display="inline-flex" align="center" gap="1">
                  <span className="ui-multi-step-form__step-index" aria-hidden="true">
                    {idx + 1}
                  </span>
                  <Text as="span" className="ui-multi-step-form__step-label">
                    {s.label}
                  </Text>
                </Box>
              </Button>
            </li>
          );
        })}
      </ol>
      <div
        className="ui-multi-step-form__content"
        role="region"
        aria-label={current?.label ?? "Step content"}
      >
        {current?.content}
      </div>
      <Box
        display="flex"
        justify="between"
        gap="content"
        padding="content"
        className="ui-multi-step-form__footer"
      >
        {footer ?? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="ui-multi-step-form__nav"
              onClick={onBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="ui-multi-step-form__nav"
              onClick={handleNext}
              disabled={currentStep >= total - 1}
            >
              Next
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
});
