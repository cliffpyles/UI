import {
  forwardRef,
  useId,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { Text } from "../../primitives/Text";
import "./FormField.css";

interface FormFieldOwnProps {
  /** Label text for the form field */
  label: ReactNode;
  /** HTML for attribute linking label to input — auto-generated if omitted */
  htmlFor?: string;
  /** Error message to display below the input */
  error?: ReactNode;
  /** Hint text to display below the input */
  hint?: ReactNode;
  /** Whether the field is required */
  required?: boolean;
  /** The input element */
  children: ReactNode;
}

export type FormFieldProps = FormFieldOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "children">;

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(
    { label, htmlFor, error, hint, required = false, children, className, ...props },
    ref,
  ) {
    const generatedId = useId();

    // Resolve the effective id: explicit htmlFor > child's existing id > auto-generated
    const child = Children.only(children);
    const childId = isValidElement(child)
      ? (child.props as Record<string, unknown>).id as string | undefined
      : undefined;
    const fieldId = htmlFor ?? childId ?? generatedId;

    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    const describedBy = [
      error ? errorId : null,
      hint && !error ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    const enhancedChild = (() => {
      if (!isValidElement(child)) return children;
      return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        id: fieldId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      });
    })();

    const classes = [
      "ui-form-field",
      error && "ui-form-field--error",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        <label className="ui-form-field__label" htmlFor={fieldId}>
          {label}
          {required && (
            <Text as="span" size="xs" weight="normal" color="secondary"> (required)</Text>
          )}
        </label>
        <div className="ui-form-field__control">{enhancedChild}</div>
        {error && (
          <div id={errorId} className="ui-form-field__error" role="alert">
            {error}
          </div>
        )}
        {hint && !error && (
          <div id={hintId} className="ui-form-field__hint">
            {hint}
          </div>
        )}
      </div>
    );
  },
);
