import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./StatusPageLayout.css";

export type SystemStatus =
  | "operational"
  | "degraded"
  | "outage"
  | "maintenance";

export interface StatusPageSystem {
  id: string;
  name: ReactNode;
  status: SystemStatus;
  uptime?: ReactNode;
  description?: ReactNode;
}

export interface StatusPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  systems: StatusPageSystem[];
  header?: ReactNode;
  incidents?: ReactNode;
  systemsLabel?: string;
  incidentsLabel?: string;
}

const STATUS_LABEL: Record<SystemStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  maintenance: "Maintenance",
};

export const StatusPageLayout = forwardRef<HTMLDivElement, StatusPageLayoutProps>(
  function StatusPageLayout(
    {
      systems,
      header,
      incidents,
      systemsLabel = "Systems status",
      incidentsLabel = "Incidents",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-status-page", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...rest}>
        {header && <header className="ui-status-page__header">{header}</header>}
        <section className="ui-status-page__systems" aria-label={systemsLabel}>
          <ul className="ui-status-page__grid" role="list">
            {systems.map((system) => (
              <li
                key={system.id}
                className={`ui-status-page__system ui-status-page__system--${system.status}`}
              >
                <div className="ui-status-page__system-header">
                  <span
                    className={`ui-status-page__indicator ui-status-page__indicator--${system.status}`}
                    aria-hidden="true"
                  />
                  <span className="ui-status-page__system-name">
                    {system.name}
                  </span>
                  <span
                    className={`ui-status-page__status ui-status-page__status--${system.status}`}
                  >
                    {STATUS_LABEL[system.status]}
                  </span>
                </div>
                {system.description && (
                  <div className="ui-status-page__system-description">
                    {system.description}
                  </div>
                )}
                {system.uptime !== undefined && (
                  <div className="ui-status-page__system-uptime">
                    {system.uptime}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
        {incidents && (
          <section
            className="ui-status-page__incidents"
            aria-label={incidentsLabel}
          >
            {incidents}
          </section>
        )}
      </div>
    );
  },
);
