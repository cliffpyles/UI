import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { formatCurrency, formatCurrencyParts } from "../../utils";
import "./Currency.css";

export interface CurrencyProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  value: number | null | undefined;
  currency: string;
  locale?: string;
  precision?: number;
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  notation?: "standard" | "compact";
}

export const Currency = forwardRef<HTMLSpanElement, CurrencyProps>(
  function Currency(
    { value, currency, locale, precision, signDisplay, notation, className, ...rest },
    ref,
  ) {
    const classes = ["ui-currency", className].filter(Boolean).join(" ");
    const isNullish = value == null || Number.isNaN(value);

    if (isNullish) {
      return (
        <span ref={ref} className={classes} {...rest}>
          <Box display="inline-flex" align="end" gap="0.5" className="ui-currency__inner">
            <Text as="span" color="secondary">—</Text>
          </Box>
        </span>
      );
    }

    const num = value as number;
    const { symbol, number } = formatCurrencyParts(num, currency, {
      locale,
      decimals: precision,
      signDisplay,
      notation,
    });

    const ariaLabel =
      notation === "compact"
        ? formatCurrency(num, currency, { locale, decimals: precision, signDisplay })
        : undefined;

    return (
      <span ref={ref} className={classes} aria-label={ariaLabel} {...rest}>
        <Box display="inline-flex" align="end" gap="0.5" className="ui-currency__inner">
          <Text as="span" color="secondary" className="ui-currency__symbol">{symbol}</Text>
          <Text as="span" tabularNums className="ui-currency__value">{number}</Text>
        </Box>
      </span>
    );
  },
);
