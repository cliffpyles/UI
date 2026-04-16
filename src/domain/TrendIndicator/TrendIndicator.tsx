import { forwardRef, type HTMLAttributes } from "react";
import { formatPercent } from "../../utils";
import "./TrendIndicator.css";

export type TrendDirection = "up" | "down" | "flat";

export interface TrendIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number | null;
  direction?: TrendDirection;
  /** Invert semantic colors: for metrics where "up" is bad (e.g. error rate). */
  invert?: boolean;
  label?: string;
  locale?: string;
}

function inferDirection(value: number | null | undefined): TrendDirection {
  if (value == null || Number.isNaN(value) || value === 0) return "flat";
  return value > 0 ? "up" : "down";
}

const ARROWS: Record<TrendDirection, string> = {
  up: "\u2191",
  down: "\u2193",
  flat: "\u2192",
};

const A11Y: Record<TrendDirection, string> = {
  up: "Increased",
  down: "Decreased",
  flat: "Unchanged",
};

export const TrendIndicator = forwardRef<HTMLSpanElement, TrendIndicatorProps>(
  function TrendIndicator(
    { value, direction, invert = false, label, locale, className, ...rest },
    ref,
  ) {
    const dir = direction ?? inferDirection(value);
    const tone = dir === "flat" ? "flat" : invert ? (dir === "up" ? "down" : "up") : dir;

    const classes = [
      "ui-trend-indicator",
      `ui-trend-indicator--${tone}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const displayValue = value != null && !Number.isNaN(value)
      ? formatPercent(Math.abs(value), { locale })
      : null;

    return (
      <span ref={ref} className={classes} {...rest}>
        <span aria-hidden="true" className="ui-trend-indicator__arrow">{ARROWS[dir]}</span>
        <span className="ui-trend-indicator__sr">{A11Y[dir]}</span>
        {displayValue && <span className="ui-trend-indicator__value">{displayValue}</span>}
        {label && <span className="ui-trend-indicator__label">{label}</span>}
      </span>
    );
  },
);
