import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Text } from "../../primitives/Text";
import "./Checkbox.css";

interface CheckboxOwnProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Change handler — receives the new checked value */
  onChange?: (checked: boolean) => void;
  /** Indeterminate (partial) state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Label text displayed next to the checkbox */
  label?: ReactNode;
  /** Description text below the label */
  description?: ReactNode;
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "defaultChecked" | "onChange"
  >;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked,
      onChange,
      indeterminate = false,
      disabled = false,
      label,
      description,
      className,
      id,
      ...props
    },
    forwardedRef,
  ) {
    const internalRef = useRef<HTMLInputElement>(null);

    // Sync indeterminate property (not an HTML attribute, must be set via JS)
    useEffect(() => {
      const el = internalRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    // Merge forwarded ref with internal ref
    const setRef = (el: HTMLInputElement | null) => {
      (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    };

    const wrapperClasses = [
      "ui-checkbox",
      disabled && "ui-checkbox--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const checkboxId = id || props["aria-label"] ? id : undefined;

    return (
      <label className={wrapperClasses}>
        <input
          ref={setRef}
          type="checkbox"
          className="ui-checkbox__input"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : undefined}
          id={checkboxId}
          {...props}
        />
        <span className="ui-checkbox__control" aria-hidden="true">
          <svg
            className="ui-checkbox__icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate ? (
              <line x1="4" y1="8" x2="12" y2="8" />
            ) : (
              <polyline points="3.5 8 6.5 11 12.5 5" />
            )}
          </svg>
        </span>
        {(label || description) && (
          <span className="ui-checkbox__content">
            {label && (
              <Text as="span" size="body" color="primary" className="ui-checkbox__label">
                {label}
              </Text>
            )}
            {description && (
              <Text as="span" size="caption" color="secondary" className="ui-checkbox__description">
                {description}
              </Text>
            )}
          </span>
        )}
      </label>
    );
  },
);
