import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon } from "../../primitives/Icon";
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
      ...props
    },
    forwardedRef,
  ) {
    const internalRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const el = internalRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

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

    return (
      <label className={wrapperClasses}>
        <Box direction="row" align="start" gap="2" className="ui-checkbox__row">
          <input
            ref={setRef}
            type="checkbox"
            className="ui-checkbox__input"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            aria-checked={indeterminate ? "mixed" : undefined}
            {...props}
          />
          <span className="ui-checkbox__control" aria-hidden="true">
            <Icon
              name={indeterminate ? "minus" : "check"}
              size="xs"
              className="ui-checkbox__icon"
              aria-hidden="true"
            />
          </span>
          {(label || description) && (
            <Box direction="column" gap="0.5" className="ui-checkbox__content">
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
            </Box>
          )}
        </Box>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
