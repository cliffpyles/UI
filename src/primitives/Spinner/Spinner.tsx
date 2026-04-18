import { forwardRef, type HTMLAttributes } from "react";
import "./Spinner.css";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerOwnProps {
  /** Visual size of the spinner */
  size?: SpinnerSize;
  /** Accessible label for screen readers */
  label?: string;
}

export type SpinnerProps = SpinnerOwnProps & HTMLAttributes<HTMLSpanElement>;

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ size = "md", label = "Loading", className, ...rest }, ref) {
    const classes = [
      "ui-spinner",
      `ui-spinner--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} role="status" className={classes} {...rest}>
        <span className="ui-spinner__label">{label}</span>
        <svg
          className="ui-spinner__circle"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            strokeWidth="3"
            strokeDasharray="75 25"
          />
        </svg>
      </span>
    );
  },
);

Spinner.displayName = "Spinner";
