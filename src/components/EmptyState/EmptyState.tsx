import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import type { IconName } from "../../primitives/Icon";
import "./EmptyState.css";

type EmptyStateVariant =
  | "no-data"
  | "no-results"
  | "error"
  | "first-use"
  | "restricted";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** The type of empty state to display. */
  variant?: EmptyStateVariant;
  /** Title text. */
  title: string;
  /** Optional description. */
  description?: ReactNode;
  /** Custom icon. If omitted, a default icon is derived from the variant. */
  icon?: ReactNode;
  /** Optional action element (e.g. a Button). */
  action?: ReactNode;
}

const variantIconMap: Record<EmptyStateVariant, IconName> = {
  "no-data": "plus",
  "no-results": "search",
  "error": "alert-circle",
  "first-use": "info",
  "restricted": "eye-off",
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      variant = "no-data",
      title,
      description,
      icon,
      action,
      className,
      ...props
    },
    ref,
  ) {
    const classes = ["ui-empty-state", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        <div className="ui-empty-state__icon">
          {icon ?? <Icon name={variantIconMap[variant]} size="xl" color="secondary" />}
        </div>
        <h3 className="ui-empty-state__title">{title}</h3>
        {description && (
          <p className="ui-empty-state__description">{description}</p>
        )}
        {action && <div className="ui-empty-state__action">{action}</div>}
      </div>
    );
  },
);
