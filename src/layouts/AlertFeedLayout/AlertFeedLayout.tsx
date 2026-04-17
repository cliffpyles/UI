import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./AlertFeedLayout.css";

export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: ReactNode;
  timestamp: ReactNode;
  content: ReactNode;
  acknowledged?: boolean;
}

export interface AlertFeedLayoutProps extends HTMLAttributes<HTMLDivElement> {
  alerts: Alert[];
  severityFilter?: AlertSeverity[];
  onAcknowledge?: (id: string) => void;
  toolbar?: ReactNode;
  feedLabel?: string;
}

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

export const AlertFeedLayout = forwardRef<HTMLDivElement, AlertFeedLayoutProps>(
  function AlertFeedLayout(
    {
      alerts,
      severityFilter,
      onAcknowledge,
      toolbar,
      feedLabel = "Alert feed",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-alert-feed", className].filter(Boolean).join(" ");
    const visible =
      severityFilter && severityFilter.length > 0
        ? alerts.filter((a) => severityFilter.includes(a.severity))
        : alerts;

    return (
      <div ref={ref} className={classes} {...rest}>
        {toolbar && (
          <div className="ui-alert-feed__toolbar" role="toolbar">
            {toolbar}
          </div>
        )}
        <section className="ui-alert-feed__feed" aria-label={feedLabel}>
          <ul className="ui-alert-feed__list" role="list">
            {visible.map((alert) => (
              <li
                key={alert.id}
                className={`ui-alert-feed__item ui-alert-feed__item--${alert.severity}${
                  alert.acknowledged ? " ui-alert-feed__item--acknowledged" : ""
                }`}
              >
                <div className="ui-alert-feed__item-header">
                  <span
                    className={`ui-alert-feed__badge ui-alert-feed__badge--${alert.severity}`}
                  >
                    {SEVERITY_LABEL[alert.severity]}
                  </span>
                  <span className="ui-alert-feed__item-title">
                    {alert.title}
                  </span>
                  <time className="ui-alert-feed__timestamp">
                    {alert.timestamp}
                  </time>
                </div>
                <div className="ui-alert-feed__item-body">{alert.content}</div>
                {onAcknowledge && (
                  <div className="ui-alert-feed__item-actions">
                    <button
                      type="button"
                      className="ui-alert-feed__ack"
                      onClick={() => onAcknowledge(alert.id)}
                      disabled={alert.acknowledged}
                    >
                      {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  },
);
