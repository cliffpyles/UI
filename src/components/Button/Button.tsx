import {
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon, type IconName } from "../../primitives/Icon";
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
  /** Icon name rendered before the label */
  icon?: IconName;
  /** Content to render inside the button */
  children?: ReactNode;
};

export type ButtonProps = ButtonOwnProps & (ButtonAsButton | ButtonAsAnchor);

const iconSizeFor: Record<ButtonSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const textSizeFor: Record<ButtonSize, "sm" | "base" | "lg"> = {
  sm: "sm",
  md: "base",
  lg: "lg",
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon,
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

  const iconNode = icon ? (
    <Icon name={icon} size={iconSizeFor[size]} aria-hidden="true" />
  ) : null;

  const labelNode =
    children !== undefined && children !== null && children !== "" ? (
      <Text as="span" size={textSizeFor[size]} weight="medium" color="inherit">
        {children}
      </Text>
    ) : null;

  const content = (
    <>
      <Box
        className={loading ? "ui-button__content ui-button__content--hidden" : "ui-button__content"}
        direction="row"
        align="center"
        justify="center"
        gap="2"
      >
        {iconNode}
        {labelNode}
      </Box>
      {loading && (
        <span className="ui-button__spinner">
          <Spinner size="sm" />
        </span>
      )}
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

Button.displayName = "Button";
