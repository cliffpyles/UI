import { forwardRef, type HTMLAttributes } from "react";
import "./DateRange.css";

export interface DateRangeProps extends HTMLAttributes<HTMLSpanElement> {
  start: Date | string | number | null | undefined;
  end: Date | string | number | null | undefined;
  locale?: string;
}

const NULL = "\u2014";

function toDate(v: Date | string | number | null | undefined): Date | null {
  if (v == null) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const DateRange = forwardRef<HTMLSpanElement, DateRangeProps>(
  function DateRange({ start, end, locale, className, ...rest }, ref) {
    const classes = ["ui-date-range", className].filter(Boolean).join(" ");
    const s = toDate(start);
    const e = toDate(end);

    if (!s || !e) {
      return (
        <span ref={ref} className={classes} {...rest}>
          {NULL}
        </span>
      );
    }

    const sameYear = s.getFullYear() === e.getFullYear();
    const sameMonth = sameYear && s.getMonth() === e.getMonth();

    const startFmt = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: sameYear ? undefined : "numeric",
    }).format(s);

    const endFmt = new Intl.DateTimeFormat(locale, {
      month: sameMonth ? undefined : "short",
      day: "numeric",
      year: "numeric",
    }).format(e);

    return (
      <span ref={ref} className={classes} {...rest}>
        {startFmt} {"\u2013"} {endFmt}
      </span>
    );
  },
);
