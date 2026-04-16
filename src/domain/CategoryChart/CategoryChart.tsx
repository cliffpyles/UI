import { forwardRef, type HTMLAttributes } from "react";
import { EmptyChart } from "../EmptyChart";
import "./CategoryChart.css";

export interface CategoryBar {
  category: string;
  value: number;
  color?: string;
}

export interface CategoryChartProps extends HTMLAttributes<HTMLDivElement> {
  data: CategoryBar[];
  width?: number;
  height?: number;
  padding?: number;
  orientation?: "vertical" | "horizontal";
  defaultColor?: string;
  ariaLabel?: string;
}

export const CategoryChart = forwardRef<HTMLDivElement, CategoryChartProps>(
  function CategoryChart(
    {
      data,
      width = 480,
      height = 240,
      padding = 32,
      orientation = "vertical",
      defaultColor = "var(--color-action-primary)",
      ariaLabel = "Category chart",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = [
      "ui-category-chart",
      `ui-category-chart--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (data.length === 0) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <EmptyChart height={height} />
        </div>
      );
    }

    const max = Math.max(...data.map((d) => d.value), 1);
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    return (
      <div ref={ref} className={classes} {...rest}>
        <svg
          className="ui-category-chart__svg"
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
        >
          {orientation === "vertical"
            ? data.map((d, i) => {
                const slot = chartW / data.length;
                const barW = slot * 0.6;
                const h = (d.value / max) * chartH;
                const x = padding + slot * i + (slot - barW) / 2;
                const y = padding + chartH - h;
                return (
                  <g key={d.category}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      fill={d.color ?? defaultColor}
                      rx={2}
                    >
                      <title>
                        {d.category}: {d.value}
                      </title>
                    </rect>
                  </g>
                );
              })
            : data.map((d, i) => {
                const slot = chartH / data.length;
                const barH = slot * 0.6;
                const w = (d.value / max) * chartW;
                const y = padding + slot * i + (slot - barH) / 2;
                return (
                  <rect
                    key={d.category}
                    x={padding}
                    y={y}
                    width={w}
                    height={barH}
                    fill={d.color ?? defaultColor}
                    rx={2}
                  >
                    <title>
                      {d.category}: {d.value}
                    </title>
                  </rect>
                );
              })}
        </svg>
      </div>
    );
  },
);
