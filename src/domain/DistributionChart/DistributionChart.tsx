import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { EmptyChart } from "../EmptyChart";
import "./DistributionChart.css";

export interface DistributionChartProps extends HTMLAttributes<HTMLDivElement> {
  data: number[];
  bins?: number;
  width?: number;
  height?: number;
  padding?: number;
  color?: string;
  ariaLabel?: string;
}

export const DistributionChart = forwardRef<HTMLDivElement, DistributionChartProps>(
  function DistributionChart(
    {
      data,
      bins = 10,
      width = 480,
      height = 200,
      padding = 24,
      color = "var(--color-action-primary)",
      ariaLabel = "Distribution chart",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-distribution-chart", className].filter(Boolean).join(" ");

    const histogram = useMemo(() => {
      if (data.length === 0) return null;
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;
      const binSize = range / bins;
      const counts = new Array(bins).fill(0);
      for (const v of data) {
        const idx = Math.min(bins - 1, Math.floor((v - min) / binSize));
        counts[idx]++;
      }
      return { counts, min, max, binSize };
    }, [data, bins]);

    if (!histogram) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <EmptyChart height={height} />
        </div>
      );
    }

    const maxCount = Math.max(...histogram.counts);
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const slot = chartW / bins;

    return (
      <div ref={ref} className={classes} {...rest}>
        <svg
          className="ui-distribution-chart__svg"
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
        >
          {histogram.counts.map((c, i) => {
            const h = (c / maxCount) * chartH;
            return (
              <rect
                key={i}
                x={padding + slot * i + 1}
                y={padding + chartH - h}
                width={slot - 2}
                height={h}
                fill={color}
                rx={1}
              >
                <title>
                  {(histogram.min + i * histogram.binSize).toFixed(2)}–
                  {(histogram.min + (i + 1) * histogram.binSize).toFixed(2)}: {c}
                </title>
              </rect>
            );
          })}
        </svg>
      </div>
    );
  },
);
