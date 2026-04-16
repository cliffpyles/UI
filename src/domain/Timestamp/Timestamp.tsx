import { forwardRef, type HTMLAttributes } from "react";
import { formatDate } from "../../utils";
import "./Timestamp.css";

export type TimestampFormat = "relative" | "absolute" | "auto";

export interface TimestampProps extends Omit<HTMLAttributes<HTMLTimeElement>, "dateTime"> {
  date: Date | string | number | null | undefined;
  format?: TimestampFormat;
  locale?: string;
}

export const Timestamp = forwardRef<HTMLTimeElement, TimestampProps>(
  function Timestamp({ date, format = "auto", locale, className, title, ...rest }, ref) {
    const classes = ["ui-timestamp", className].filter(Boolean).join(" ");

    if (date == null) {
      return (
        <time ref={ref} className={classes} {...rest}>
          {"\u2014"}
        </time>
      );
    }

    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      return (
        <time ref={ref} className={classes} {...rest}>
          {"\u2014"}
        </time>
      );
    }

    const style = format === "absolute" ? "full" : format === "auto" ? "relative" : "relative";
    const display = formatDate(d, { format: style, locale });
    const tooltip =
      title ?? (format === "absolute" ? formatDate(d, { format: "relative", locale }) : formatDate(d, { format: "full", locale }));

    return (
      <time ref={ref} className={classes} dateTime={d.toISOString()} title={tooltip} {...rest}>
        {display}
      </time>
    );
  },
);
