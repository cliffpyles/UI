import { forwardRef, type HTMLAttributes } from "react";
import { Text } from "../../primitives/Text";
import { formatCurrency } from "../../utils";

export interface CurrencyProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  value: number | null | undefined;
  currency: string;
  locale?: string;
  decimals?: number;
}

export const Currency = forwardRef<HTMLSpanElement, CurrencyProps>(
  function Currency({ value, currency, locale, decimals, className, ...rest }, ref) {
    const display = formatCurrency(value, currency, { locale, decimals });
    return (
      <Text as="span" tabularNums color="inherit" ref={ref} className={["ui-currency", className].filter(Boolean).join(" ")} {...rest}>
        {display}
      </Text>
    );
  },
);
