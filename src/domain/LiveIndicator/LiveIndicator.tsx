import { forwardRef, type HTMLAttributes } from "react";
import "./LiveIndicator.css";

export interface LiveIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  label?: string;
}

export const LiveIndicator = forwardRef<HTMLSpanElement, LiveIndicatorProps>(
  function LiveIndicator({ active = true, label = "Live", className, ...rest }, ref) {
    const classes = [
      "ui-live-indicator",
      active && "ui-live-indicator--active",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        role="status"
        aria-live="polite"
        {...rest}
      >
        <span className="ui-live-indicator__pulse" aria-hidden="true">
          <span className="ui-live-indicator__dot" />
          {active && <span className="ui-live-indicator__ring" />}
        </span>
        <span className="ui-live-indicator__label">{label}</span>
      </span>
    );
  },
);
