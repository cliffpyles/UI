import { forwardRef, type HTMLAttributes } from "react";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Toggle } from "../../components/Toggle";
import type { FilterFieldType } from "../OperatorSelect";
import "./ValueInput.css";

export interface ValueInputOption {
  value: string;
  label: string;
}

export interface ValueInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  fieldType: FilterFieldType;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean | null) => void;
  options?: ValueInputOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const ValueInput = forwardRef<HTMLDivElement, ValueInputProps>(
  function ValueInput(
    { fieldType, value, onChange, options, placeholder, disabled, className, ...rest },
    ref,
  ) {
    const classes = ["ui-value-input", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {fieldType === "enum" && options ? (
          <Select
            aria-label="Value"
            value={String(value ?? "")}
            onChange={onChange}
            options={options}
            disabled={disabled}
            placeholder={placeholder}
          />
        ) : fieldType === "boolean" ? (
          <Toggle
            checked={Boolean(value)}
            onChange={(checked) => onChange(checked)}
            disabled={disabled}
            aria-label="Value"
          />
        ) : fieldType === "number" ? (
          <Input
            aria-label="Value"
            type="number"
            value={value == null ? "" : String(value)}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v === "" ? null : Number(v));
            }}
            disabled={disabled}
            placeholder={placeholder}
          />
        ) : fieldType === "date" ? (
          <Input
            aria-label="Value"
            type="date"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
          />
        ) : (
          <Input
            aria-label="Value"
            type="text"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  },
);
