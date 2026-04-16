import { forwardRef, type HTMLAttributes } from "react";
import { Icon, type IconName } from "../../primitives/Icon";
import "./TeamBadge.css";

export type TeamBadgeSize = "sm" | "md" | "lg";

export interface TeamData {
  id?: string;
  name: string;
  color?: string;
  icon?: IconName;
}

export interface TeamBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  team: TeamData;
  size?: TeamBadgeSize;
  showLabel?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const TeamBadge = forwardRef<HTMLSpanElement, TeamBadgeProps>(
  function TeamBadge({ team, size = "md", showLabel = true, className, style, ...rest }, ref) {
    const classes = ["ui-team-badge", `ui-team-badge--${size}`, className]
      .filter(Boolean)
      .join(" ");

    const markStyle = team.color ? { backgroundColor: team.color } : undefined;

    return (
      <span ref={ref} className={classes} style={style} {...rest}>
        <span
          className="ui-team-badge__mark"
          style={markStyle}
          aria-hidden={showLabel ? true : undefined}
          role={showLabel ? undefined : "img"}
          aria-label={showLabel ? undefined : team.name}
        >
          {team.icon ? <Icon name={team.icon} size="xs" /> : getInitials(team.name)}
        </span>
        {showLabel && <span className="ui-team-badge__name">{team.name}</span>}
      </span>
    );
  },
);
