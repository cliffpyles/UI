import { forwardRef, type HTMLAttributes } from "react";
import { Dot } from "../../primitives/Dot";
import "./HealthIndicator.css";

export type Health = "healthy" | "degraded" | "down" | "unknown";

export interface HealthIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  health: Health;
  label?: string;
  showLabel?: boolean;
}

const TONE_MAP: Record<Health, "success" | "warning" | "error" | "neutral"> = {
  healthy: "success",
  degraded: "warning",
  down: "error",
  unknown: "neutral",
};

const DEFAULT_LABELS: Record<Health, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
  unknown: "Unknown",
};

export const HealthIndicator = forwardRef<HTMLSpanElement, HealthIndicatorProps>(
  function HealthIndicator({ health, label, showLabel = true, className, ...rest }, ref) {
    const tone = TONE_MAP[health];
    const text = label ?? DEFAULT_LABELS[health];
    const classes = ["ui-health-indicator", `ui-health-indicator--${health}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        role="status"
        aria-label={showLabel ? undefined : text}
        {...rest}
      >
        <Dot color={tone} size="sm" />
        {showLabel && <span className="ui-health-indicator__label">{text}</span>}
      </span>
    );
  },
);
