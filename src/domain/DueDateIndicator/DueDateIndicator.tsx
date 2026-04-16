import { forwardRef, type HTMLAttributes } from "react";
import { Icon } from "../../primitives/Icon";
import { formatDate } from "../../utils";
import "./DueDateIndicator.css";

export type DueDateStatus = "upcoming" | "approaching" | "overdue" | "completed";

export interface DueDateIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  date: Date | string | number | null | undefined;
  status?: DueDateStatus;
  locale?: string;
  now?: Date;
}

function computeStatus(date: Date, now: Date): DueDateStatus {
  const ms = date.getTime() - now.getTime();
  const days = ms / 86_400_000;
  if (ms < 0) return "overdue";
  if (days <= 3) return "approaching";
  return "upcoming";
}

export const DueDateIndicator = forwardRef<HTMLSpanElement, DueDateIndicatorProps>(
  function DueDateIndicator({ date, status, locale, now, className, ...rest }, ref) {
    if (date == null) {
      return (
        <span ref={ref} className={className} {...rest}>
          {"\u2014"}
        </span>
      );
    }
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      return (
        <span ref={ref} className={className} {...rest}>
          {"\u2014"}
        </span>
      );
    }

    const reference = now ?? new Date();
    const actual = status ?? computeStatus(d, reference);
    const classes = [
      "ui-due-date-indicator",
      `ui-due-date-indicator--${actual}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <Icon name="clock" size="xs" aria-hidden />
        <span>{formatDate(d, { format: "short", locale, now: reference })}</span>
      </span>
    );
  },
);
