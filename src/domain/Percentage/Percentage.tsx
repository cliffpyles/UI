import { forwardRef, type HTMLAttributes } from "react";
import { Text } from "../../primitives/Text";
import { formatPercent } from "../../utils";

export interface PercentageProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  value: number | null | undefined;
  precision?: number;
  showSign?: boolean;
  locale?: string;
}

export const Percentage = forwardRef<HTMLSpanElement, PercentageProps>(
  function Percentage({ value, precision, showSign, locale, className, ...rest }, ref) {
    const display = formatPercent(value, { decimals: precision, sign: showSign, locale });
    return (
      <Text as="span" tabularNums color="inherit" ref={ref} className={["ui-percentage", className].filter(Boolean).join(" ")} {...rest}>
        {display}
      </Text>
    );
  },
);
