import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import "./Toggle.css";

type ToggleSize = "sm" | "md";

interface ToggleOwnProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Size of the toggle */
  size?: ToggleSize;
  /** Label text */
  label?: ReactNode;
}

export type ToggleProps = ToggleOwnProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "checked" | "defaultChecked" | "onChange"
  >;

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  function Toggle(
    {
      checked: controlledChecked,
      defaultChecked,
      onChange,
      disabled = false,
      size = "md",
      label,
      className,
      ...props
    },
    ref,
  ) {
    const [internalChecked, setInternalChecked] = useState(
      defaultChecked ?? false,
    );
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      if (!isControlled) {
        setInternalChecked(newValue);
      }
      onChange?.(newValue);
    };

    const wrapperClasses = [
      "ui-toggle",
      `ui-toggle--${size}`,
      disabled && "ui-toggle--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={wrapperClasses}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="ui-toggle__input"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          aria-checked={isChecked}
          {...props}
        />
        <span className="ui-toggle__track">
          <span className="ui-toggle__thumb" />
        </span>
        {label && <span className="ui-toggle__label">{label}</span>}
      </label>
    );
  },
);
