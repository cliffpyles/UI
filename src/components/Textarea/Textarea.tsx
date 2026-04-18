import { forwardRef, type TextareaHTMLAttributes } from "react";
import "./Textarea.css";

type TextareaSize = "sm" | "md" | "lg";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";

interface TextareaOwnProps {
  size?: TextareaSize;
  error?: boolean;
  resize?: TextareaResize;
}

export type TextareaProps = TextareaOwnProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      size = "md",
      error = false,
      resize = "vertical",
      className,
      disabled,
      ...props
    },
    ref,
  ) {
    const classes = [
      "ui-textarea",
      `ui-textarea--${size}`,
      `ui-textarea--resize-${resize}`,
      error && "ui-textarea--error",
      disabled && "ui-textarea--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <textarea
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
