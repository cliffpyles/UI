import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon, type IconName } from "../../primitives/Icon";
import { Button } from "../../components/Button";
import "./BannerAlert.css";

export type BannerAlertVariant = "info" | "success" | "warning" | "error";
/** Spec alias — see design/components/domain/BannerAlert.md */
export type BannerAlertSeverity = BannerAlertVariant;

export interface BannerAlertAction {
  label: string;
  onAction: () => void;
}

export interface BannerAlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: BannerAlertVariant;
  /** Alias for `variant`, per spec. */
  severity?: BannerAlertSeverity;
  title?: ReactNode;
  description?: ReactNode;
  icon?: IconName | false;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: BannerAlertAction | ReactNode;
  children?: ReactNode;
}

const DEFAULT_ICON: Record<BannerAlertVariant, IconName> = {
  info: "info",
  success: "check",
  warning: "alert-triangle",
  error: "alert-circle",
};

function isActionObject(a: unknown): a is BannerAlertAction {
  return (
    !!a &&
    typeof a === "object" &&
    "label" in (a as Record<string, unknown>) &&
    "onAction" in (a as Record<string, unknown>)
  );
}

export const BannerAlert = forwardRef<HTMLDivElement, BannerAlertProps>(
  function BannerAlert(
    {
      variant,
      severity,
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
    const sev: BannerAlertVariant = severity ?? variant ?? "info";
    const classes = [
      "ui-banner-alert",
      `ui-banner-alert--${sev}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
    const iconName = icon === false ? null : (icon ?? DEFAULT_ICON[sev]);
    const role = sev === "error" || sev === "warning" ? "alert" : "status";

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        direction="row"
        align="start"
        gap="3"
        role={role}
        {...rest}
      >
        {iconName && (
          <Icon
            name={iconName}
            size="md"
            className="ui-banner-alert__icon"
            aria-hidden
          />
        )}
        <Box direction="column" gap="1" grow minWidth={0} className="ui-banner-alert__body">
          {title && (
            <Text as="span" size="sm" weight="semibold" className="ui-banner-alert__title">
              {title}
            </Text>
          )}
          {description && (
            <Text as="p" size="sm" color="secondary" className="ui-banner-alert__description">
              {description}
            </Text>
          )}
          {children}
        </Box>
        {isActionObject(action) ? (
          <Button
            variant="ghost"
            size="sm"
            className="ui-banner-alert__action"
            onClick={action.onAction}
          >
            {action.label}
          </Button>
        ) : (
          action && <Box className="ui-banner-alert__action">{action}</Box>
        )}
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            icon="x"
            className="ui-banner-alert__dismiss"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          />
        )}
      </Box>
    );
  },
);

BannerAlert.displayName = "BannerAlert";
