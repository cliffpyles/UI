import { forwardRef, type HTMLAttributes } from "react";
import { formatNumber, formatCompact, formatCurrency, formatPercent } from "../../utils";
import "./MetricValue.css";

export type MetricFormat = "number" | "compact" | "currency" | "percent";

export interface MetricValueProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  format?: MetricFormat;
  unit?: string;
  precision?: number;
  compact?: boolean;
  currency?: string;
  locale?: string;
}

export const MetricValue = forwardRef<HTMLSpanElement, MetricValueProps>(
  function MetricValue(
    { value, format = "number", unit, precision, compact, currency = "USD", locale, className, ...rest },
    ref,
  ) {
    const classes = ["ui-metric-value", className].filter(Boolean).join(" ");

    let display: string;
    if (format === "currency") {
      display = formatCurrency(value, currency, { locale, decimals: precision });
    } else if (format === "percent") {
      display = formatPercent(value, { locale, decimals: precision });
    } else if (compact || format === "compact") {
      display = formatCompact(value, { locale, decimals: precision });
    } else {
      display = formatNumber(value, { locale, decimals: precision });
    }

    return (
      <span ref={ref} className={classes} {...rest}>
        <span className="ui-metric-value__number">{display}</span>
        {unit && value != null && !Number.isNaN(value) && (
          <span className="ui-metric-value__unit">{unit}</span>
        )}
      </span>
    );
  },
);
