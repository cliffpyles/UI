import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Text } from "../../primitives/Text";
import "./EmptyStateScaffoldLayout.css";

export interface EmptyStateScaffoldLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  illustration?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  steps?: ReactNode[];
}

export const EmptyStateScaffoldLayout = forwardRef<
  HTMLDivElement,
  EmptyStateScaffoldLayoutProps
>(function EmptyStateScaffoldLayout(
  {
    illustration,
    title,
    description,
    primaryAction,
    secondaryAction,
    steps,
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-empty-state-scaffold", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Empty state"
      className={classes}
      {...rest}
    >
      <div className="ui-empty-state-scaffold__inner">
        {illustration && (
          <div
            className="ui-empty-state-scaffold__illustration"
            aria-hidden="true"
          >
            {illustration}
          </div>
        )}
        <Text as="h2" size="xl" weight="semibold" className="ui-empty-state-scaffold__title">
          {title}
        </Text>
        {description && (
          <Text as="p" size="sm" color="secondary" className="ui-empty-state-scaffold__description">
            {description}
          </Text>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="ui-empty-state-scaffold__actions">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
        {steps && steps.length > 0 && (
          <ol
            className="ui-empty-state-scaffold__steps"
            aria-label="Getting started steps"
          >
            {steps.map((step, idx) => (
              <li key={idx} className="ui-empty-state-scaffold__step">
                <span
                  className="ui-empty-state-scaffold__step-marker"
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <span className="ui-empty-state-scaffold__step-body">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
});
