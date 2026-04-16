import { forwardRef, type HTMLAttributes } from "react";
import type { EntityData } from "../EntityLink";
import "./MentionToken.css";

export type MentionVariant = "user" | "team" | "channel" | "entity";

export interface MentionTokenProps extends HTMLAttributes<HTMLSpanElement> {
  entity: EntityData | { type: string; label: string; id?: string | number };
  variant?: MentionVariant;
}

const PREFIX: Record<MentionVariant, string> = {
  user: "@",
  team: "@",
  channel: "#",
  entity: "#",
};

export const MentionToken = forwardRef<HTMLSpanElement, MentionTokenProps>(
  function MentionToken({ entity, variant = "user", className, ...rest }, ref) {
    const classes = ["ui-mention-token", `ui-mention-token--${variant}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <span aria-hidden="true">{PREFIX[variant]}</span>
        {entity.label}
      </span>
    );
  },
);
