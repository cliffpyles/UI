import { forwardRef, type HTMLAttributes } from "react";
import "./Sparkline.css";

export interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "error";
  label?: string;
}

export const Sparkline = forwardRef<HTMLDivElement, SparklineProps>(
  function Sparkline(
    { data, width = 80, height = 24, strokeWidth = 1.5, variant = "default", label, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-sparkline",
      `ui-sparkline--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (!data || data.length < 2) {
      return (
        <div ref={ref} className={classes} style={{ width, height }} role="img" aria-label={label ?? "No data"} {...rest} />
      );
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    const points = data
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / range) * height;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <svg
          className="ui-sparkline__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={label ?? `Trend from ${data[0]} to ${data[data.length - 1]}`}
        >
          <polyline
            className="ui-sparkline__line"
            fill="none"
            strokeWidth={strokeWidth}
            points={points}
          />
        </svg>
      </div>
    );
  },
);
