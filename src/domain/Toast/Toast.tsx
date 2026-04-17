import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Icon, type IconName } from "../../primitives/Icon";
import "./Toast.css";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const ICON: Record<ToastVariant, IconName> = {
  info: "info",
  success: "info",
  warning: "alert-triangle",
  error: "alert-circle",
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    variant = "info",
    title,
    description,
    action,
    onDismiss,
    dismissible = true,
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-toast", `ui-toast--${variant}`, className].filter(Boolean).join(" ");
  const role = variant === "error" || variant === "warning" ? "alert" : "status";

  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      className={classes}
      display="flex"
      align="start"
      gap="2"
      role={role}
      aria-live={role === "alert" ? "assertive" : "polite"}
      {...rest}
    >
      <Icon name={ICON[variant]} size="sm" className="ui-toast__icon" aria-hidden />
      <Box className="ui-toast__body" grow minWidth={0}>
        <div className="ui-toast__title">{title}</div>
        {description && <div className="ui-toast__description">{description}</div>}
      </Box>
      {action && <div className="ui-toast__action">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="ui-toast__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <Icon name="x" size="xs" aria-hidden />
        </button>
      )}
    </Box>
  );
});
