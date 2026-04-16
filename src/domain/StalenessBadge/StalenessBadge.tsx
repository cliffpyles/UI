import { forwardRef, type HTMLAttributes } from "react";
import { Badge } from "../../primitives/Badge";
import { formatDate } from "../../utils";
import "./StalenessBadge.css";

export interface StalenessBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  lastUpdated: Date | string | number | null | undefined;
  /** Milliseconds after which data is considered stale (yellow). Default 5 min. */
  staleThreshold?: number;
  /** Milliseconds after which data is considered critical (red). Default 30 min. */
  criticalThreshold?: number;
  locale?: string;
  now?: Date;
}

export const StalenessBadge = forwardRef<HTMLSpanElement, StalenessBadgeProps>(
  function StalenessBadge(
    {
      lastUpdated,
      staleThreshold = 5 * 60_000,
      criticalThreshold = 30 * 60_000,
      locale,
      now,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-staleness-badge", className].filter(Boolean).join(" ");

    if (lastUpdated == null) {
      return (
        <Badge ref={ref} variant="neutral" className={classes} {...rest}>
          {"\u2014"}
        </Badge>
      );
    }

    const date = lastUpdated instanceof Date ? lastUpdated : new Date(lastUpdated);
    if (Number.isNaN(date.getTime())) {
      return (
        <Badge ref={ref} variant="neutral" className={classes} {...rest}>
          {"\u2014"}
        </Badge>
      );
    }

    const reference = now ?? new Date();
    const age = reference.getTime() - date.getTime();
    const variant =
      age >= criticalThreshold ? "error" : age >= staleThreshold ? "warning" : "success";
    const label = formatDate(date, { format: "relative", locale, now: reference });

    return (
      <Badge
        ref={ref}
        variant={variant}
        className={classes}
        title={date.toISOString()}
        {...rest}
      >
        {label}
      </Badge>
    );
  },
);
