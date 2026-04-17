import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
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
    <Box
      ref={ref as Ref<HTMLElement>}
      display="flex"
      direction="column"
      gap="section"
      padding="page"
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
      {charts && (
        <Box direction="column" gap="content" className="ui-metric-overview__charts">
          {charts}
        </Box>
      )}
    </Box>
  );
});
