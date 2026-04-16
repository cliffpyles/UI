import { forwardRef, type HTMLAttributes } from "react";
import { Badge } from "../../primitives/Badge";

export type RoleBadgeSize = "sm" | "md";

export interface RoleDef {
  id: string;
  label: string;
  tone?: "neutral" | "success" | "warning" | "error" | "info";
}

export interface RoleBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  role: string;
  roles?: Record<string, RoleDef>;
  size?: RoleBadgeSize;
}

const DEFAULT_ROLES: Record<string, RoleDef> = {
  admin: { id: "admin", label: "Admin", tone: "error" },
  owner: { id: "owner", label: "Owner", tone: "warning" },
  member: { id: "member", label: "Member", tone: "info" },
  viewer: { id: "viewer", label: "Viewer", tone: "neutral" },
  guest: { id: "guest", label: "Guest", tone: "neutral" },
};

export const RoleBadge = forwardRef<HTMLSpanElement, RoleBadgeProps>(
  function RoleBadge({ role, roles = DEFAULT_ROLES, size = "md", className, ...rest }, ref) {
    const def = roles[role] ?? { id: role, label: role, tone: "neutral" as const };
    return (
      <Badge ref={ref} variant={def.tone ?? "neutral"} size={size} className={className} {...rest}>
        {def.label}
      </Badge>
    );
  },
);
