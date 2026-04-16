import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import "./DependencyLink.css";

export type DependencyType = "blocks" | "requires" | "relates";

export interface DependencyLinkProps extends HTMLAttributes<HTMLSpanElement> {
  from: ReactNode;
  to: ReactNode;
  type?: DependencyType;
}

const LABELS: Record<DependencyType, string> = {
  blocks: "blocks",
  requires: "requires",
  relates: "relates to",
};

export const DependencyLink = forwardRef<HTMLSpanElement, DependencyLinkProps>(
  function DependencyLink({ from, to, type = "blocks", className, ...rest }, ref) {
    const classes = [
      "ui-dependency-link",
      `ui-dependency-link--${type}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <span className="ui-dependency-link__from">{from}</span>
        <Icon name="external-link" size="xs" aria-hidden />
        <span className="ui-dependency-link__type">{LABELS[type]}</span>
        <span className="ui-dependency-link__to">{to}</span>
      </span>
    );
  },
);
