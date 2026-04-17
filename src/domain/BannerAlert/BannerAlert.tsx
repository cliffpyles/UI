import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Icon, type IconName } from "../../primitives/Icon";
import "./BannerAlert.css";

export type BannerAlertVariant = "info" | "success" | "warning" | "error";

export interface BannerAlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BannerAlertVariant;
  title?: string;
  description?: ReactNode;
  icon?: IconName | false;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  children?: ReactNode;
}

const DEFAULT_ICON: Record<BannerAlertVariant, IconName> = {
  info: "info",
  success: "info",
  warning: "alert-triangle",
  error: "alert-circle",
};

export const BannerAlert = forwardRef<HTMLDivElement, BannerAlertProps>(
  function BannerAlert(
    {
      variant = "info",
      title,
      description,
      icon,
      dismissible,
      onDismiss,
      action,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-banner-alert", `ui-banner-alert--${variant}`, className]
      .filter(Boolean)
      .join(" ");
    const iconName = icon === false ? null : (icon ?? DEFAULT_ICON[variant]);
    const role = variant === "error" || variant === "warning" ? "alert" : "status";

    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        align="start"
        gap="3"
        role={role}
        {...rest}
      >
        {iconName && (
          <Icon name={iconName} size="md" className="ui-banner-alert__icon" aria-hidden />
        )}
        <Box className="ui-banner-alert__body" grow minWidth={0}>
          {title && <div className="ui-banner-alert__title">{title}</div>}
          {description && <div className="ui-banner-alert__description">{description}</div>}
          {children}
        </Box>
        {action && <div className="ui-banner-alert__action">{action}</div>}
        {dismissible && (
          <button
            type="button"
            className="ui-banner-alert__dismiss"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <Icon name="x" size="sm" aria-hidden />
          </button>
        )}
      </Box>
    );
  },
);
