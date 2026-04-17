import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Text } from "../../primitives/Text";
import "./OnboardingChecklistLayout.css";

export interface ChecklistTask {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  completed: boolean;
  href?: string;
  action?: ReactNode;
}

export interface OnboardingChecklistLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tasks: ChecklistTask[];
  onDismiss?: () => void;
  dismissible?: boolean;
  title?: ReactNode;
}

export const OnboardingChecklistLayout = forwardRef<
  HTMLDivElement,
  OnboardingChecklistLayoutProps
>(function OnboardingChecklistLayout(
  {
    tasks,
    onDismiss,
    dismissible = false,
    title = "Get started",
    className,
    ...rest
  },
  ref,
) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const classes = ["ui-onboarding-checklist", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Onboarding checklist"
      className={classes}
      {...rest}
    >
      <div className="ui-onboarding-checklist__header">
        <Text as="h2" size="lg" weight="semibold" className="ui-onboarding-checklist__title">
          {title}
        </Text>
        {dismissible && (
          <button
            type="button"
            className="ui-onboarding-checklist__dismiss"
            onClick={onDismiss}
            aria-label="Dismiss checklist"
          >
            Dismiss
          </button>
        )}
      </div>
      <div className="ui-onboarding-checklist__progress">
        <div
          className="ui-onboarding-checklist__progress-bar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding progress"
        >
          <div
            className="ui-onboarding-checklist__progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="ui-onboarding-checklist__progress-text">
          {completed} of {total} complete
        </span>
      </div>
      <ul className="ui-onboarding-checklist__list">
        {tasks.map((task) => {
          const itemClasses = [
            "ui-onboarding-checklist__item",
            task.completed && "ui-onboarding-checklist__item--completed",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={task.id} className={itemClasses}>
              <span
                className="ui-onboarding-checklist__check"
                aria-hidden="true"
              >
                {task.completed ? "✓" : ""}
              </span>
              <div className="ui-onboarding-checklist__body">
                {task.href ? (
                  <a
                    href={task.href}
                    className="ui-onboarding-checklist__item-title"
                  >
                    {task.title}
                  </a>
                ) : (
                  <span className="ui-onboarding-checklist__item-title">
                    {task.title}
                  </span>
                )}
                {task.description && (
                  <span className="ui-onboarding-checklist__item-desc">
                    {task.description}
                  </span>
                )}
              </div>
              {task.action && (
                <div className="ui-onboarding-checklist__action">
                  {task.action}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});
