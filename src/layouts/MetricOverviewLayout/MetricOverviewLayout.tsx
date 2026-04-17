import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./MetricOverviewLayout.css";

export type MetricItem = ReactNode | { key: string; content: ReactNode };

export interface MetricOverviewLayoutProps extends HTMLAttributes<HTMLDivElement> {
  metrics: MetricItem[];
  charts?: ReactNode;
  label?: string;
}

function isKeyedMetric(
  item: MetricItem,
): item is { key: string; content: ReactNode } {
  return (
    typeof item === "object" &&
    item !== null &&
    !Array.isArray(item) &&
    "key" in (item as object) &&
    "content" in (item as object)
  );
}

export const MetricOverviewLayout = forwardRef<
  HTMLDivElement,
  MetricOverviewLayoutProps
>(function MetricOverviewLayout(
  { metrics, charts, label = "Metric overview", className, ...rest },
  ref,
) {
  const classes = ["ui-metric-overview", className].filter(Boolean).join(" ");
  return (
    <div
      ref={ref}
      className={classes}
      role="region"
      aria-label={label}
      {...rest}
    >
      <div className="ui-metric-overview__metrics">
        {metrics.map((item, i) => {
          if (isKeyedMetric(item)) {
            return (
              <div key={item.key} className="ui-metric-overview__metric">
                {item.content}
              </div>
            );
          }
          return (
            <div key={i} className="ui-metric-overview__metric">
              {item}
            </div>
          );
        })}
      </div>
      {charts && <div className="ui-metric-overview__charts">{charts}</div>}
    </div>
  );
});
