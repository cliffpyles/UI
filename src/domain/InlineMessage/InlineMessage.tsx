import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Icon, type IconName } from "../../primitives/Icon";
import "./InlineMessage.css";

export type InlineMessageVariant = "info" | "success" | "warning" | "error";

export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: InlineMessageVariant;
  icon?: IconName | false;
  title?: string;
  children?: ReactNode;
}

const DEFAULT_ICON: Record<InlineMessageVariant, IconName> = {
  info: "info",
  success: "info",
  warning: "alert-triangle",
  error: "alert-circle",
};

export const InlineMessage = forwardRef<HTMLDivElement, InlineMessageProps>(
  function InlineMessage(
    { variant = "info", icon, title, children, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-inline-message",
      `ui-inline-message--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
    const iconName = icon === false ? null : (icon ?? DEFAULT_ICON[variant]);
    const role = variant === "error" || variant === "warning" ? "alert" : "status";

    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        gap="2"
        role={role}
        {...rest}
      >
        {iconName && (
          <Icon name={iconName} size="sm" className="ui-inline-message__icon" aria-hidden />
        )}
        <Box className="ui-inline-message__body" grow minWidth={0}>
          {title && <div className="ui-inline-message__title">{title}</div>}
          {children && <div className="ui-inline-message__content">{children}</div>}
        </Box>
      </Box>
    );
  },
);
