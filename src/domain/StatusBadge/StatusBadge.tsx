import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Badge } from "../../primitives/Badge";
import { Dot } from "../../primitives/Dot";
import { Icon, type IconName } from "../../primitives/Icon";
import "./StatusBadge.css";

type StatusTone = "neutral" | "success" | "warning" | "error" | "info";
type StatusSize = "sm" | "md";

export interface StatusDef {
  label: string;
  tone: StatusTone;
  icon?: IconName;
}

export type StatusMap = Record<string, StatusDef>;

export interface StatusBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  status: string;
  statusMap?: StatusMap;
  size?: StatusSize;
  children?: ReactNode;
}

const DEFAULT_MAP: StatusMap = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "error" },
  archived: { label: "Archived", tone: "neutral" },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ status, statusMap, size = "md", className, ...rest }, ref) {
    const map = statusMap ?? DEFAULT_MAP;
    const def = map[status] ?? { label: status, tone: "neutral" as StatusTone };
    const classes = ["ui-status-badge", className].filter(Boolean).join(" ");

    return (
      <Badge ref={ref} variant={def.tone} size={size} className={classes} {...rest}>
        {def.icon ? (
          <Icon name={def.icon} size="xs" aria-hidden />
        ) : (
          <Dot color={def.tone} size="sm" />
        )}
        <span className="ui-status-badge__label">{def.label}</span>
      </Badge>
    );
  },
);
