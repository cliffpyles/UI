import {
  forwardRef,
  useState,
  type SelectHTMLAttributes,
} from "react";
import "./Select.css";

type SelectSize = "sm" | "md" | "lg";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectOwnProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
  /** Options to display */
  options: SelectOption[];
  /** Visual size */
  size?: SelectSize;
  /** Whether the select is in an error state */
  error?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
}

export type SelectProps = SelectOwnProps &
  Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "size" | "value" | "defaultValue" | "onChange"
  >;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder,
      options,
      size = "md",
      error = false,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const wrapperClasses = [
      "ui-select",
      `ui-select--${size}`,
      error && "ui-select--error",
      disabled && "ui-select--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <select
          ref={ref}
          className="ui-select__native"
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={error || undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="ui-select__arrow" aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    );
  },
);
