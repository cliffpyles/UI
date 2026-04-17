import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./IncidentDetailLayout.css";

export interface IncidentDetailLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  header: ReactNode;
  timeline: ReactNode;
  signals?: ReactNode;
  responders?: ReactNode;
  actions?: ReactNode;
  timelineLabel?: string;
  signalsLabel?: string;
  respondersLabel?: string;
  actionsLabel?: string;
}

export const IncidentDetailLayout = forwardRef<
  HTMLDivElement,
  IncidentDetailLayoutProps
>(function IncidentDetailLayout(
  {
    header,
    timeline,
    signals,
    responders,
    actions,
    timelineLabel = "Timeline",
    signalsLabel = "Signals",
    respondersLabel = "Responders",
    actionsLabel = "Actions",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-incident-detail", className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={classes} {...rest}>
      <header className="ui-incident-detail__header">{header}</header>
      {actions && (
        <section
          className="ui-incident-detail__actions"
          aria-label={actionsLabel}
        >
          {actions}
        </section>
      )}
      <section
        className="ui-incident-detail__timeline"
        aria-label={timelineLabel}
      >
        {timeline}
      </section>
      {signals && (
        <section
          className="ui-incident-detail__signals"
          aria-label={signalsLabel}
        >
          {signals}
        </section>
      )}
      {responders && (
        <section
          className="ui-incident-detail__responders"
          aria-label={respondersLabel}
        >
          {responders}
        </section>
      )}
    </div>
  );
});
