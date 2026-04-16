import { forwardRef, type HTMLAttributes } from "react";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import "./UnitInput.css";

export interface UnitOption {
  value: string;
  label: string;
}

export interface UnitInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number | null;
  onChange: (value: number | null) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
  units: UnitOption[];
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export const UnitInput = forwardRef<HTMLDivElement, UnitInputProps>(
  function UnitInput(
    {
      value,
      onChange,
      unit,
      onUnitChange,
      units,
      size,
      placeholder,
      disabled,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-unit-input", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...rest}>
        <Input
          type="number"
          inputMode="decimal"
          value={value == null ? "" : value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          className="ui-unit-input__value"
        />
        <Select
          options={units}
          value={unit}
          onChange={onUnitChange}
          disabled={disabled}
          size={size}
          aria-label="Unit"
          className="ui-unit-input__unit"
        />
      </div>
    );
  },
);
