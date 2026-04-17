import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Grid } from "../../primitives/Grid";
import "./ChartGridLayout.css";

export interface ChartGridItem {
  id: string;
  content: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export interface ChartGridLayoutProps extends HTMLAttributes<HTMLDivElement> {
  charts: ChartGridItem[];
  columns?: number;
  label?: string;
}

export const ChartGridLayout = forwardRef<HTMLDivElement, ChartGridLayoutProps>(
  function ChartGridLayout(
    { charts, columns = 12, label = "Chart grid", className, style, ...rest },
    ref,
  ) {
    const classes = ["ui-chart-grid", className].filter(Boolean).join(" ");
    return (
      <Grid
        ref={ref as Ref<HTMLElement>}
        gap="content"
        className={classes}
        role="region"
        aria-label={label}
        style={{
          ["--ui-chart-grid-columns" as string]: columns,
          ...style,
        }}
        {...rest}
      >
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="ui-chart-grid__item"
            style={{
              gridColumn: `span ${Math.min(chart.colSpan ?? 1, columns)}`,
              gridRow: chart.rowSpan ? `span ${chart.rowSpan}` : undefined,
            }}
          >
            {chart.content}
          </div>
        ))}
      </Grid>
    );
  },
);
