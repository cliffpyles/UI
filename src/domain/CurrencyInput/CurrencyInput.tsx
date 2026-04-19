import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { formatCurrencyParts } from "../../utils";
import "./CurrencyInput.css";

export interface MoneyValue {
  amount: number | null;
  currency: string;
}

export interface CurrencyInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value: MoneyValue;
  onChange: (next: MoneyValue) => void;
  currencies?: string[];
  locale?: string;
  min?: number;
  max?: number;
  precision?: number;
  disabled?: boolean;
  error?: boolean;
  readOnly?: boolean;
}

function currencySymbol(currency: string, locale?: string): string {
  try {
    return formatCurrencyParts(0, currency, { locale }).symbol || currency;
  } catch {
    return currency;
  }
}

export const CurrencyInput = forwardRef<HTMLDivElement, CurrencyInputProps>(
  function CurrencyInput(
    {
      value,
      onChange,
      currencies = ["USD"],
      locale,
      min,
      max,
      precision = 2,
      disabled = false,
      error = false,
      readOnly = false,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-currency-input", className].filter(Boolean).join(" ");
    const symbol = currencySymbol(value.currency, locale);
    const step = precision > 0 ? `0.${"0".repeat(precision - 1)}1` : "1";

    return (
      <Box
        as="div"
        ref={ref}
        direction="row"
        gap="1"
        className={classes}
        {...rest}
      >
        <Input
          aria-label="Amount"
          aria-invalid={error || undefined}
          aria-readonly={readOnly || undefined}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value.amount == null ? "" : value.amount}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...value,
              amount: v === "" ? null : Number(v),
            });
          }}
          leadingAddon={
            <Text as="span" aria-hidden className="ui-currency-input__symbol">
              {symbol}
            </Text>
          }
          disabled={disabled}
          readOnly={readOnly}
          error={error}
        />
        <Select
          aria-label="Currency"
          options={currencies.map((c) => ({ value: c, label: c }))}
          value={value.currency}
          onChange={(c) => onChange({ ...value, currency: c })}
          disabled={disabled || readOnly}
        />
      </Box>
    );
  },
);
