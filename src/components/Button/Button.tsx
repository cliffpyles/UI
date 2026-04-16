import {
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { Spinner } from "../../primitives/Spinner";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

type ButtonAsButton = {
  as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsAnchor = {
  as: "a";
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonOwnProps = {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size */
  size?: ButtonSize;
  /** Loading state — shows spinner and disables interaction */
  loading?: boolean;
  /** Content to render inside the button */
  children?: ReactNode;
};

export type ButtonProps = ButtonOwnProps & (ButtonAsButton | ButtonAsAnchor);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    as = "button",
    className,
    children,
    ...props
  },
  ref,
) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    loading && "ui-button--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && (
        <span className="ui-button__spinner">
          <Spinner size="sm" />
        </span>
      )}
      <span
        className={`ui-button__label${loading ? " ui-button__label--hidden" : ""}`}
      >
        {children}
      </span>
    </>
  );

  if (as === "a") {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={loading || undefined}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={buttonProps.disabled || loading}
      {...buttonProps}
    >
      {content}
    </button>
  );
});
