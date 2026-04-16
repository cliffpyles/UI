import { forwardRef, type HTMLAttributes } from "react";
import { formatCurrency } from "../../utils";
import "./Currency.css";

export interface CurrencyProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  currency: string;
  locale?: string;
  decimals?: number;
}

export const Currency = forwardRef<HTMLSpanElement, CurrencyProps>(
  function Currency({ value, currency, locale, decimals, className, ...rest }, ref) {
    const classes = ["ui-currency", className].filter(Boolean).join(" ");
    const display = formatCurrency(value, currency, { locale, decimals });
    return (
      <span ref={ref} className={classes} {...rest}>
        {display}
      </span>
    );
  },
);
