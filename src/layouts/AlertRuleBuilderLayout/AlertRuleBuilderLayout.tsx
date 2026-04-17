import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./AlertRuleBuilderLayout.css";

export interface AlertRuleBuilderLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  conditions: ReactNode;
  channels?: ReactNode;
  preview?: ReactNode;
  test?: ReactNode;
  footer?: ReactNode;
  conditionsLabel?: string;
  channelsLabel?: string;
  previewLabel?: string;
  testLabel?: string;
}

export const AlertRuleBuilderLayout = forwardRef<
  HTMLDivElement,
  AlertRuleBuilderLayoutProps
>(function AlertRuleBuilderLayout(
  {
    conditions,
    channels,
    preview,
    test,
    footer,
    conditionsLabel = "Conditions",
    channelsLabel = "Channels",
    previewLabel = "Preview",
    testLabel = "Test",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-alert-rule-builder", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div ref={ref} className={classes} {...rest}>
      <section
        className="ui-alert-rule-builder__section ui-alert-rule-builder__section--conditions"
        aria-label={conditionsLabel}
      >
        {conditions}
      </section>
      {channels && (
        <section
          className="ui-alert-rule-builder__section ui-alert-rule-builder__section--channels"
          aria-label={channelsLabel}
        >
          {channels}
        </section>
      )}
      {preview && (
        <section
          className="ui-alert-rule-builder__section ui-alert-rule-builder__section--preview"
          aria-label={previewLabel}
        >
          {preview}
        </section>
      )}
      {test && (
        <section
          className="ui-alert-rule-builder__section ui-alert-rule-builder__section--test"
          aria-label={testLabel}
        >
          {test}
        </section>
      )}
      {footer && (
        <footer className="ui-alert-rule-builder__footer">{footer}</footer>
      )}
    </div>
  );
});
