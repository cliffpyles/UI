import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "../../components/Input";

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "size"> {
  value: number | null;
  onChange: (value: number | null) => void;
  currency?: string;
  locale?: string;
  size?: "sm" | "md" | "lg";
}

function getSymbol(currency: string, locale?: string): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? currency;
  } catch {
    return currency;
  }
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { value, onChange, currency = "USD", locale, size, ...rest },
    ref,
  ) {
    const symbol = getSymbol(currency, locale);

    return (
      <Input
        ref={ref}
        type="number"
        inputMode="decimal"
        step="0.01"
        value={value == null ? "" : value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        leadingAddon={<span aria-hidden="true">{symbol}</span>}
        size={size}
        {...rest}
      />
    );
  },
);
