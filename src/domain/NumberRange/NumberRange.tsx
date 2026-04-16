import { forwardRef, type HTMLAttributes } from "react";
import { formatNumber } from "../../utils";
import "./NumberRange.css";

export interface NumberRangeProps extends HTMLAttributes<HTMLSpanElement> {
  min: number | null | undefined;
  max: number | null | undefined;
  decimals?: number;
  locale?: string;
}

const NULL = "\u2014";

export const NumberRange = forwardRef<HTMLSpanElement, NumberRangeProps>(
  function NumberRange({ min, max, decimals, locale, className, ...rest }, ref) {
    const classes = ["ui-number-range", className].filter(Boolean).join(" ");
    if (min == null || max == null || Number.isNaN(min) || Number.isNaN(max)) {
      return (
        <span ref={ref} className={classes} {...rest}>
          {NULL}
        </span>
      );
    }
    return (
      <span ref={ref} className={classes} {...rest}>
        {formatNumber(min, { decimals, locale })} {"\u2013"} {formatNumber(max, { decimals, locale })}
      </span>
    );
  },
);
