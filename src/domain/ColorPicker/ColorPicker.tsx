import { forwardRef, type HTMLAttributes } from "react";
import { defaultPalette } from "./palette";
import "./ColorPicker.css";

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (color: string) => void;
  palette?: string[];
  allowCustom?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    {
      value,
      onChange,
      palette = defaultPalette,
      allowCustom = true,
      disabled,
      className,
      "aria-label": ariaLabel = "Color",
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-color-picker", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="radiogroup"
        aria-label={ariaLabel}
        {...rest}
      >
        {palette.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={color === value}
            aria-label={color}
            disabled={disabled}
            className={
              "ui-color-picker__swatch" +
              (color === value ? " ui-color-picker__swatch--selected" : "")
            }
            style={{ background: color }}
            onClick={() => onChange(color)}
          />
        ))}
        {allowCustom && (
          <label className="ui-color-picker__custom">
            <input
              type="color"
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              aria-label="Custom color"
            />
          </label>
        )}
      </div>
    );
  },
);
