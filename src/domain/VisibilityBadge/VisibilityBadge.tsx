import { forwardRef, type HTMLAttributes } from "react";
import { Icon, type IconName } from "../../primitives/Icon";
import "./VisibilityBadge.css";

export type Visibility = "private" | "team" | "public" | "org";

export interface VisibilityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  visibility: Visibility;
  showLabel?: boolean;
}

const LABELS: Record<Visibility, string> = {
  private: "Private",
  team: "Team",
  public: "Public",
  org: "Organization",
};

const ICONS: Record<Visibility, IconName> = {
  private: "eye-off",
  team: "user",
  public: "eye",
  org: "settings",
};

export const VisibilityBadge = forwardRef<HTMLSpanElement, VisibilityBadgeProps>(
  function VisibilityBadge(
    { visibility, showLabel = true, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-visibility-badge",
      `ui-visibility-badge--${visibility}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
    const label = LABELS[visibility];

    return (
      <span
        ref={ref}
        className={classes}
        {...(showLabel ? {} : { role: "img", "aria-label": label })}
        {...rest}
      >
        <Icon name={ICONS[visibility]} size="xs" aria-hidden />
        {showLabel && <span>{label}</span>}
      </span>
    );
  },
);
