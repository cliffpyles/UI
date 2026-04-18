import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import "./Input.css";

type InputSize = "sm" | "md" | "lg";

interface InputOwnProps {
  /** Visual size of the input */
  size?: InputSize;
  /** Whether the input is in an error state */
  error?: boolean;
  /** Icon rendered before the input (typically an Icon primitive) */
  leadingIcon?: ReactNode;
  /** Icon rendered after the input (typically an Icon primitive) */
  trailingIcon?: ReactNode;
  /** Addon rendered before the input (outside the border) */
  leadingAddon?: ReactNode;
  /** Addon rendered after the input (outside the border) */
  trailingAddon?: ReactNode;
}

export type InputProps = InputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      size = "md",
      error = false,
      leadingIcon,
      trailingIcon,
      leadingAddon,
      trailingAddon,
      className,
      disabled,
      ...props
    },
    ref,
  ) {
    const wrapperClasses = [
      "ui-input-wrapper",
      `ui-input-wrapper--${size}`,
      error && "ui-input-wrapper--error",
      disabled && "ui-input-wrapper--disabled",
      leadingAddon && "ui-input-wrapper--has-leading-addon",
      trailingAddon && "ui-input-wrapper--has-trailing-addon",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        direction="row"
        align="stretch"
        className={wrapperClasses}
      >
        {leadingAddon && (
          <span className="ui-input__addon ui-input__addon--leading">
            {leadingAddon}
          </span>
        )}
        <Box
          direction="row"
          align="center"
          className="ui-input__field-wrapper"
          grow
          minWidth={0}
        >
          {leadingIcon && (
            <span className="ui-input__icon ui-input__icon--leading">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            className="ui-input__field"
            disabled={disabled}
            aria-invalid={error || undefined}
            {...props}
          />
          {trailingIcon && (
            <span className="ui-input__icon ui-input__icon--trailing">
              {trailingIcon}
            </span>
          )}
        </Box>
        {trailingAddon && (
          <span className="ui-input__addon ui-input__addon--trailing">
            {trailingAddon}
          </span>
        )}
      </Box>
    );
  },
);

Input.displayName = "Input";
