import { forwardRef, type HTMLAttributes } from "react";
import "./RatioBar.css";

export type RatioBarVariant = "default" | "success" | "warning" | "error";
export type RatioBarSize = "sm" | "md";

export interface RatioBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number | null | undefined;
  max?: number;
  label?: string;
  showLabel?: boolean;
  variant?: RatioBarVariant;
  size?: RatioBarSize;
}

export const RatioBar = forwardRef<HTMLDivElement, RatioBarProps>(
  function RatioBar(
    { value, max = 100, label, showLabel = false, variant = "default", size = "md", className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-ratio-bar",
      `ui-ratio-bar--${variant}`,
      `ui-ratio-bar--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const safe = value == null || Number.isNaN(value) ? 0 : Math.min(max, Math.max(0, value));
    const pct = max > 0 ? (safe / max) * 100 : 0;

    return (
      <div ref={ref} className={classes} {...rest}>
        {(label || showLabel) && (
          <div className="ui-ratio-bar__header">
            {label && <span className="ui-ratio-bar__label">{label}</span>}
            {showLabel && (
              <span className="ui-ratio-bar__value">
                {safe} / {max}
              </span>
            )}
          </div>
        )}
        <div
          className="ui-ratio-bar__track"
          role="progressbar"
          aria-valuenow={safe}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          <div className="ui-ratio-bar__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  },
);
