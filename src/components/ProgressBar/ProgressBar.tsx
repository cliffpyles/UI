import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
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
          <Box justify="between" className="ui-progress-bar__header">
            {label && (
              <Text
                as="span"
                size="label"
                weight="medium"
                className="ui-progress-bar__label"
              >
                {label}
              </Text>
            )}
            {showValue && !indeterminate && (
              <Text
                as="span"
                size="caption"
                weight="medium"
                color="secondary"
                tabularNums
                className="ui-progress-bar__value"
              >
                {Math.round(percentage)}%
              </Text>
            )}
          </Box>
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

ProgressBar.displayName = "ProgressBar";
