import { forwardRef, type HTMLAttributes } from "react";
import "./EnvironmentTag.css";

export type Environment = "production" | "staging" | "development" | "preview" | "test";
export type EnvironmentTagVariant = "solid" | "outline";

export interface EnvironmentTagProps extends HTMLAttributes<HTMLSpanElement> {
  environment: Environment | string;
  variant?: EnvironmentTagVariant;
  label?: string;
}

const LABELS: Record<string, string> = {
  production: "Prod",
  staging: "Staging",
  development: "Dev",
  preview: "Preview",
  test: "Test",
};

export const EnvironmentTag = forwardRef<HTMLSpanElement, EnvironmentTagProps>(
  function EnvironmentTag({ environment, variant = "solid", label, className, ...rest }, ref) {
    const text = label ?? LABELS[environment] ?? environment;
    const classes = [
      "ui-environment-tag",
      `ui-environment-tag--${environment}`,
      `ui-environment-tag--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {text}
      </span>
    );
  },
);
