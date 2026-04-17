import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useValueChange } from "./useValueChange";
import "./ValueChangeIndicator.css";

export interface ValueChangeIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** The value being tracked. When it changes, the highlight plays. */
  value: unknown;
  /** Whether to apply the background flash on change. Defaults to true. */
  highlight?: boolean;
  /** Whether to show a ▲/▼ arrow for numeric direction. */
  direction?: boolean;
  /** Children rendered inside the indicator (usually the formatted value). */
  children: ReactNode;
  /** Rate limit: skip highlight if changes happen faster than this (ms). */
  rateLimitMs?: number;
}

export const ValueChangeIndicator = forwardRef<HTMLSpanElement, ValueChangeIndicatorProps>(
  function ValueChangeIndicator(
    { value, highlight = true, direction = false, children, rateLimitMs, className, ...rest },
    ref,
  ) {
    const { isHighlighted, direction: dir } = useValueChange(value, {
      direction,
      rateLimitMs,
    });

    const classes = [
      "ui-value-change",
      highlight && isHighlighted && "ui-value-change--highlight",
      direction && dir === "up" && "ui-value-change--up",
      direction && dir === "down" && "ui-value-change--down",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {direction && dir !== "none" && (
          <span className="ui-value-change__arrow" aria-hidden="true">
            {dir === "up" ? "▲" : "▼"}
          </span>
        )}
        <span className="ui-value-change__content">{children}</span>
      </span>
    );
  },
);
