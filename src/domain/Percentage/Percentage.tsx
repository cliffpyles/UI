import { forwardRef, type HTMLAttributes } from "react";
import { formatPercent } from "../../utils";
import "./Percentage.css";

export interface PercentageProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  precision?: number;
  showSign?: boolean;
  locale?: string;
}

export const Percentage = forwardRef<HTMLSpanElement, PercentageProps>(
  function Percentage({ value, precision, showSign, locale, className, ...rest }, ref) {
    const classes = ["ui-percentage", className].filter(Boolean).join(" ");
    const display = formatPercent(value, { decimals: precision, sign: showSign, locale });
    return (
      <span ref={ref} className={classes} {...rest}>
        {display}
      </span>
    );
  },
);
