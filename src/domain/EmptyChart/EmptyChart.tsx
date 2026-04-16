import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { EmptyState } from "../../components/EmptyState";
import "./EmptyChart.css";

export interface EmptyChartProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "no-data" | "error" | "filtered";
  title?: string;
  message?: string;
  action?: ReactNode;
  height?: number | string;
}

const DEFAULT_TITLES: Record<string, string> = {
  "no-data": "No data to display",
  error: "Could not load chart",
  filtered: "No results match filters",
};

export const EmptyChart = forwardRef<HTMLDivElement, EmptyChartProps>(
  function EmptyChart(
    { variant = "no-data", title, message, action, height = 200, className, ...rest },
    ref,
  ) {
    const classes = ["ui-empty-chart", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} style={{ minHeight: height }} {...rest}>
        <EmptyState
          title={title ?? DEFAULT_TITLES[variant]}
          description={message}
          action={action}
        />
      </div>
    );
  },
);
