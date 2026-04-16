import { forwardRef, type HTMLAttributes } from "react";
import { EmptyChart } from "../EmptyChart";
import "./FunnelChart.css";

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelChartProps extends HTMLAttributes<HTMLDivElement> {
  stages: FunnelStage[];
  color?: string;
  ariaLabel?: string;
}

export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  function FunnelChart(
    {
      stages,
      color = "var(--color-action-primary)",
      ariaLabel = "Funnel chart",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-funnel-chart", className].filter(Boolean).join(" ");

    if (stages.length === 0) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <EmptyChart />
        </div>
      );
    }

    const max = Math.max(...stages.map((s) => s.value), 1);

    return (
      <div ref={ref} className={classes} role="figure" aria-label={ariaLabel} {...rest}>
        {stages.map((s, i) => {
          const prev = i === 0 ? null : stages[i - 1];
          const pct = (s.value / max) * 100;
          const conv = prev && prev.value > 0 ? (s.value / prev.value) * 100 : null;
          return (
            <div key={s.label} className="ui-funnel-chart__stage">
              <div className="ui-funnel-chart__header">
                <span className="ui-funnel-chart__label">{s.label}</span>
                <span className="ui-funnel-chart__value">{s.value.toLocaleString()}</span>
              </div>
              <div
                className="ui-funnel-chart__bar"
                style={{ width: `${pct}%`, background: color }}
              />
              {conv != null && (
                <div className="ui-funnel-chart__conversion">
                  {conv.toFixed(1)}% conversion
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);
