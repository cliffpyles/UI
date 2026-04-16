import { forwardRef, type HTMLAttributes } from "react";
import { EmptyChart } from "../EmptyChart";
import "./TimeSeriesChart.css";

export interface TimeSeriesPoint {
  x: Date | number | string;
  y: number;
}

export interface TimeSeriesSeries {
  id: string;
  label: string;
  color: string;
  data: TimeSeriesPoint[];
}

export interface TimeSeriesChartProps extends HTMLAttributes<HTMLDivElement> {
  series: TimeSeriesSeries[];
  width?: number;
  height?: number;
  padding?: number;
  variant?: "line" | "area";
  ariaLabel?: string;
}

function toTime(x: TimeSeriesPoint["x"]): number {
  if (x instanceof Date) return x.getTime();
  if (typeof x === "number") return x;
  return new Date(x).getTime();
}

export const TimeSeriesChart = forwardRef<HTMLDivElement, TimeSeriesChartProps>(
  function TimeSeriesChart(
    {
      series,
      width = 600,
      height = 240,
      padding = 32,
      variant = "line",
      ariaLabel = "Time series chart",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-time-series-chart", className].filter(Boolean).join(" ");
    const hasData = series.some((s) => s.data.length > 0);

    if (!hasData) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <EmptyChart height={height} />
        </div>
      );
    }

    const allPoints = series.flatMap((s) => s.data);
    const xs = allPoints.map((p) => toTime(p.x));
    const ys = allPoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(0, ...ys);
    const maxY = Math.max(...ys);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    const scaleX = (v: number) => padding + ((v - minX) / rangeX) * chartW;
    const scaleY = (v: number) => padding + chartH - ((v - minY) / rangeY) * chartH;

    return (
      <div ref={ref} className={classes} {...rest}>
        <svg
          className="ui-time-series-chart__svg"
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
        >
          <g className="ui-time-series-chart__axis" aria-hidden="true">
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
            />
          </g>
          {series.map((s) => {
            const sorted = [...s.data].sort((a, b) => toTime(a.x) - toTime(b.x));
            const points = sorted
              .map((p) => `${scaleX(toTime(p.x)).toFixed(2)},${scaleY(p.y).toFixed(2)}`)
              .join(" ");
            const areaPath = sorted.length
              ? `M ${scaleX(toTime(sorted[0].x))},${scaleY(minY)} L ${points} L ${scaleX(toTime(sorted[sorted.length - 1].x))},${scaleY(minY)} Z`
              : "";
            return (
              <g key={s.id}>
                {variant === "area" && (
                  <path d={areaPath} fill={s.color} fillOpacity={0.2} />
                )}
                <polyline
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  points={points}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
);
