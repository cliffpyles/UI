import { forwardRef, type HTMLAttributes } from "react";
import "./ProgressBar.css";

type ProgressBarVariant = "default" | "success" | "warning" | "error";
type ProgressBarSize = "sm" | "md";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value (0-100). When undefined, renders indeterminate animation. */
  value?: number;
  /** Maximum value. */
  max?: number;
  /** Visual variant. */
  variant?: ProgressBarVariant;
  /** Size. */
  size?: ProgressBarSize;
  /** Accessible label for the progress bar. */
  label?: string;
  /** Whether to display the numeric value. */
  showValue?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value,
      max = 100,
      variant = "default",
      size = "md",
      label,
      showValue = false,
      className,
      ...props
    },
    ref,
  ) {
    const indeterminate = value === undefined;
    const percentage = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

    const classes = [
      "ui-progress-bar",
      `ui-progress-bar--${variant}`,
      `ui-progress-bar--${size}`,
      indeterminate && "ui-progress-bar--indeterminate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {(label || showValue) && (
          <div className="ui-progress-bar__header">
            {label && <span className="ui-progress-bar__label">{label}</span>}
            {showValue && !indeterminate && (
              <span className="ui-progress-bar__value">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          className="ui-progress-bar__track"
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className="ui-progress-bar__fill"
            style={
              indeterminate ? undefined : { width: `${percentage}%` }
            }
          />
        </div>
      </div>
    );
  },
);
