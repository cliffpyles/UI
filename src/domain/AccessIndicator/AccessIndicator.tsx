import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Icon, type IconName } from "../../primitives/Icon";
import { Tooltip } from "../../components/Tooltip";
import "./AccessIndicator.css";

export type AccessStatus = "locked" | "restricted" | "open" | "shared";

export interface AccessIndicatorProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Access status for the referenced record. */
  status: AccessStatus;
  /** Optional tooltip copy override. Falls back to the default per-status label. */
  label?: ReactNode;
}

const statusIcon: Record<AccessStatus, IconName> = {
  locked: "lock",
  restricted: "lock",
  open: "globe",
  shared: "users",
};

const statusLabel: Record<AccessStatus, string> = {
  locked: "Locked",
  restricted: "Restricted access",
  open: "Open access",
  shared: "Shared",
};

export const AccessIndicator = forwardRef<HTMLSpanElement, AccessIndicatorProps>(
  function AccessIndicator({ status, label, className, ...rest }, ref) {
    const classes = [
      "ui-access-indicator",
      `ui-access-indicator--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const accessibleLabel =
      typeof label === "string" && label.length > 0
        ? label
        : statusLabel[status];

    return (
      <Tooltip content={label ?? statusLabel[status]}>
        <span
          ref={ref}
          role="img"
          aria-label={accessibleLabel}
          tabIndex={0}
          className={classes}
          {...rest}
        >
          <Box align="center" justify="center" className="ui-access-indicator__inner">
            <Icon name={statusIcon[status]} size="sm" aria-hidden />
          </Box>
        </span>
      </Tooltip>
    );
  },
);

AccessIndicator.displayName = "AccessIndicator";
