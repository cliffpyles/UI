import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "../../components/Input";

export interface PercentageInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "size" | "min" | "max"> {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  precision?: number;
  size?: "sm" | "md" | "lg";
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export const PercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
  function PercentageInput(
    { value, onChange, min = 0, max = 100, precision = 2, size, ...rest },
    ref,
  ) {
    return (
      <Input
        ref={ref}
        type="number"
        inputMode="decimal"
        step={precision > 0 ? 1 / Math.pow(10, precision) : 1}
        min={min}
        max={max}
        value={value == null ? "" : value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") {
            onChange(null);
            return;
          }
          const n = Number(v);
          onChange(Number.isNaN(n) ? null : clamp(n, min, max));
        }}
        trailingAddon={<span aria-hidden="true">%</span>}
        size={size}
        {...rest}
      />
    );
  },
);
