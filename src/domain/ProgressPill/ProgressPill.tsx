import { forwardRef, type HTMLAttributes } from "react";
import "./ProgressPill.css";

export type ProgressPillVariant = "default" | "success" | "warning" | "error";

export interface ProgressPillProps extends HTMLAttributes<HTMLDivElement> {
  progress: number;
  max?: number;
  label?: string;
  variant?: ProgressPillVariant;
  showValue?: boolean;
}

export const ProgressPill = forwardRef<HTMLDivElement, ProgressPillProps>(
  function ProgressPill(
    { progress, max = 100, label, variant = "default", showValue = true, className, ...rest },
    ref,
  ) {
    const pct = Math.min(100, Math.max(0, (progress / max) * 100));
    const classes = [
      "ui-progress-pill",
      `ui-progress-pill--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        {...rest}
      >
        <div className="ui-progress-pill__fill" style={{ width: `${pct}%` }} />
        <span className="ui-progress-pill__content">
          {label && <span className="ui-progress-pill__label">{label}</span>}
          {showValue && <span className="ui-progress-pill__value">{Math.round(pct)}%</span>}
        </span>
      </div>
    );
  },
);
