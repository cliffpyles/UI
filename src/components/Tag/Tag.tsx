import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./Tag.css";

type TagVariant = "neutral" | "primary" | "success" | "warning" | "error";
type TagSize = "sm" | "md";

interface TagOwnProps {
  /** Color variant */
  variant?: TagVariant;
  /** Size */
  size?: TagSize;
  /** Whether the tag can be removed */
  removable?: boolean;
  /** Called when the remove button is clicked */
  onRemove?: () => void;
  /** Tag content */
  children?: ReactNode;
}

export type TagProps = TagOwnProps & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  function Tag(
    {
      variant = "neutral",
      size = "md",
      removable = false,
      onRemove,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const classes = [
      "ui-tag",
      `ui-tag--${variant}`,
      `ui-tag--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...props}>
        <span className="ui-tag__content">{children}</span>
        {removable && (
          <button
            type="button"
            className="ui-tag__remove"
            onClick={onRemove}
            aria-label={`Remove ${typeof children === "string" ? children : ""}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    );
  },
);
