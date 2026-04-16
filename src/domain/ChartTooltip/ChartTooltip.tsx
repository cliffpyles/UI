import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./ChartTooltip.css";

export interface ChartTooltipRow {
  label: ReactNode;
  value: ReactNode;
  color?: string;
}

export interface ChartTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  rows: ChartTooltipRow[];
  position?: { x: number; y: number };
}

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  function ChartTooltip({ title, rows, position, className, style, ...rest }, ref) {
    const classes = ["ui-chart-tooltip", className].filter(Boolean).join(" ");
    const mergedStyle = {
      ...style,
      ...(position
        ? { transform: `translate(${position.x}px, ${position.y}px)` }
        : {}),
    };

    return (
      <div ref={ref} className={classes} role="tooltip" style={mergedStyle} {...rest}>
        {title && <div className="ui-chart-tooltip__title">{title}</div>}
        <div className="ui-chart-tooltip__rows">
          {rows.map((r, i) => (
            <div key={i} className="ui-chart-tooltip__row">
              {r.color && (
                <span
                  className="ui-chart-tooltip__swatch"
                  style={{ background: r.color }}
                  aria-hidden="true"
                />
              )}
              <span className="ui-chart-tooltip__label">{r.label}</span>
              <span className="ui-chart-tooltip__value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
