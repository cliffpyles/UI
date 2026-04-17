import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./OperationsCenterLayout.css";

export interface OperationsMetric {
  id: string;
  content: ReactNode;
}

export interface OperationsCenterLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  metrics: OperationsMetric[];
  header?: ReactNode;
  footer?: ReactNode;
  metricsLabel?: string;
}

export const OperationsCenterLayout = forwardRef<
  HTMLDivElement,
  OperationsCenterLayoutProps
>(function OperationsCenterLayout(
  {
    metrics,
    header,
    footer,
    metricsLabel = "Operations metrics",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-ops-center", className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={classes} {...rest}>
      {header && <header className="ui-ops-center__header">{header}</header>}
      <section className="ui-ops-center__grid" aria-label={metricsLabel}>
        {metrics.map((metric) => (
          <div key={metric.id} className="ui-ops-center__cell">
            {metric.content}
          </div>
        ))}
      </section>
      {footer && <footer className="ui-ops-center__footer">{footer}</footer>}
    </div>
  );
});
