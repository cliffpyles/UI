import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { formatDateRangeParts } from "../../utils/format";
import "./DateRange.css";

export interface DateRangeProps extends HTMLAttributes<HTMLSpanElement> {
  start: Date | string | null;
  end: Date | string | null;
  locale?: string;
  format?: "short" | "medium" | "long";
  collapse?: boolean;
  separator?: "en-dash" | "to";
}

const EM_DASH = "\u2014";
const EN_DASH = "\u2013";

function toDate(v: Date | string | null | undefined): Date | null {
  if (v == null) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const DateRange = forwardRef<HTMLSpanElement, DateRangeProps>(
  function DateRange(
    {
      start,
      end,
      locale,
      format = "medium",
      collapse = true,
      separator = "en-dash",
      className,
      "aria-label": ariaLabelProp,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-date-range", className].filter(Boolean).join(" ");
    const s = toDate(start);
    const e = toDate(end);
    const sep = separator === "to" ? "to" : EN_DASH;

    if (!s && !e) {
      return (
        <span
          ref={ref}
          className={classes}
          aria-label={ariaLabelProp ?? "No date range"}
          {...rest}
        >
          {EM_DASH}
        </span>
      );
    }

    if (!s || !e) {
      const only = (s ?? e) as Date;
      const onlyFmt = new Intl.DateTimeFormat(locale, {
        month: format === "long" ? "long" : "short",
        day: "numeric",
        year: "numeric",
      }).format(only);
      const openStart = !s;
      return (
        <span
          ref={ref}
          className={classes}
          aria-label={
            ariaLabelProp ??
            (openStart ? `Until ${onlyFmt}` : `From ${onlyFmt}`)
          }
          {...rest}
        >
          <Box display="inline-flex" align="center" gap="1">
            {openStart ? (
              <>
                <Text as="span" color="secondary">{EM_DASH}</Text>
                <Text as="span" color="secondary" aria-hidden="true">{sep}</Text>
                <Text as="span">{onlyFmt}</Text>
              </>
            ) : (
              <>
                <Text as="span">{onlyFmt}</Text>
                <Text as="span" color="secondary" aria-hidden="true">{sep}</Text>
                <Text as="span" color="secondary">{EM_DASH}</Text>
              </>
            )}
          </Box>
        </span>
      );
    }

    const parts = formatDateRangeParts(s, e, { locale, format, collapse });

    return (
      <span
        ref={ref}
        className={classes}
        aria-label={ariaLabelProp ?? parts.ariaLabel}
        {...rest}
      >
        <Box display="inline-flex" align="center" gap="1">
          <Text as="span">{parts.start}</Text>
          <Text as="span" color="secondary" aria-hidden="true">{sep}</Text>
          <Text as="span">{parts.end}</Text>
        </Box>
      </span>
    );
  },
);
