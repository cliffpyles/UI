import { forwardRef, type HTMLAttributes } from "react";
import { Icon } from "../../primitives/Icon";
import { Tooltip } from "../../components/Tooltip";
import "./AccessIndicator.css";

export interface AccessIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  hasAccess: boolean;
  reason?: string;
  label?: string;
}

export const AccessIndicator = forwardRef<HTMLSpanElement, AccessIndicatorProps>(
  function AccessIndicator({ hasAccess, reason, label, className, ...rest }, ref) {
    const classes = [
      "ui-access-indicator",
      hasAccess ? "ui-access-indicator--allowed" : "ui-access-indicator--restricted",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <span
        ref={ref}
        className={classes}
        role="img"
        aria-label={label ?? (hasAccess ? "Access granted" : "Access restricted")}
        {...rest}
      >
        <Icon name={hasAccess ? "eye" : "eye-off"} size="xs" aria-hidden />
      </span>
    );

    if (reason) {
      return <Tooltip content={reason}>{content}</Tooltip>;
    }
    return content;
  },
);
