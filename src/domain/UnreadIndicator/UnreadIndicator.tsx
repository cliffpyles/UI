import { forwardRef, type HTMLAttributes } from "react";
import "./UnreadIndicator.css";

export type UnreadIndicatorVariant = "dot" | "count";

export interface UnreadIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  variant?: UnreadIndicatorVariant;
  max?: number;
  label?: string;
}

export const UnreadIndicator = forwardRef<HTMLSpanElement, UnreadIndicatorProps>(
  function UnreadIndicator(
    { count, variant, max = 99, label, className, ...rest },
    ref,
  ) {
    const actualVariant: UnreadIndicatorVariant =
      variant ?? (count == null ? "dot" : "count");

    if (actualVariant === "dot" || count == null) {
      const classes = ["ui-unread-indicator", "ui-unread-indicator--dot", className]
        .filter(Boolean)
        .join(" ");
      return (
        <span
          ref={ref}
          className={classes}
          role="status"
          aria-label={label ?? "Unread"}
          {...rest}
        />
      );
    }

    if (count <= 0) return null;

    const display = count > max ? `${max}+` : String(count);
    const classes = ["ui-unread-indicator", "ui-unread-indicator--count", className]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        role="status"
        aria-label={label ?? `${count} unread`}
        {...rest}
      >
        {display}
      </span>
    );
  },
);
