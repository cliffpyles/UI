/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
import "./WizardFrame.css";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  optional?: boolean;
}

interface WizardContextValue {
  steps: WizardStep[];
  currentStep: number;
  completedSteps: number[];
}

const WizardContext = createContext<WizardContextValue | null>(null);

function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("WizardFrame children must be inside WizardFrame");
  return ctx;
}

export interface WizardFrameProps extends HTMLAttributes<HTMLDivElement> {
  steps: WizardStep[];
  currentStep: number;
  completedSteps?: number[];
  children: ReactNode;
}

const WizardFrameRoot = forwardRef<HTMLDivElement, WizardFrameProps>(
  function WizardFrame(
    { steps, currentStep, completedSteps = [], children, className, ...rest },
    ref,
  ) {
    const classes = ["ui-wizard-frame", className].filter(Boolean).join(" ");
    return (
      <WizardContext.Provider value={{ steps, currentStep, completedSteps }}>
        <div ref={ref} className={classes} {...rest}>
          {children}
        </div>
      </WizardContext.Provider>
    );
  },
);

const WizardStepIndicator = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(
  function WizardStepIndicator({ className, ...rest }, ref) {
    const { steps, currentStep, completedSteps } = useWizard();
    const classes = ["ui-wizard-frame__steps", className].filter(Boolean).join(" ");
    return (
      <ol ref={ref} className={classes} aria-label="Wizard progress" {...rest}>
        {steps.map((step, idx) => {
          const done = completedSteps.includes(idx);
          const active = idx === currentStep;
          return (
            <li
              key={step.id}
              className={[
                "ui-wizard-frame__step",
                done && "ui-wizard-frame__step--done",
                active && "ui-wizard-frame__step--active",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={active ? "step" : undefined}
            >
              <span
                className="ui-wizard-frame__step-marker"
                aria-hidden="true"
              >
                {done ? <Icon name="check" size="xs" /> : idx + 1}
              </span>
              <span className="ui-wizard-frame__step-text">
                <Text as="span" size="sm" weight="medium" color="primary" className="ui-wizard-frame__step-label">{step.label}</Text>
                {step.description && (
                  <Text as="span" size="xs" color="tertiary">
                    {step.description}
                  </Text>
                )}
                {step.optional && (
                  <Text as="span" size="xs" color="tertiary">
                    Optional
                  </Text>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    );
  },
);

const WizardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function WizardContent({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={["ui-wizard-frame__content", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

const WizardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function WizardFooter({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={["ui-wizard-frame__footer", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export const WizardFrame = Object.assign(WizardFrameRoot, {
  StepIndicator: WizardStepIndicator,
  Content: WizardContent,
  Footer: WizardFooter,
});
