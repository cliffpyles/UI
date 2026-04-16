import { forwardRef, type HTMLAttributes } from "react";
import "./ChartLegend.css";

export interface LegendSeries {
  id: string;
  label: string;
  color: string;
  visible?: boolean;
}

export interface ChartLegendProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  series: LegendSeries[];
  onToggle?: (id: string) => void;
  orientation?: "horizontal" | "vertical";
}

export const ChartLegend = forwardRef<HTMLDivElement, ChartLegendProps>(
  function ChartLegend(
    { series, onToggle, orientation = "horizontal", className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-chart-legend",
      `ui-chart-legend--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} role="group" aria-label="Chart legend" {...rest}>
        {series.map((s) => {
          const visible = s.visible !== false;
          const isButton = !!onToggle;
          const commonProps = {
            className:
              "ui-chart-legend__item" +
              (visible ? "" : " ui-chart-legend__item--hidden"),
            "aria-pressed": isButton ? visible : undefined,
            onClick: isButton ? () => onToggle(s.id) : undefined,
          };
          const content = (
            <>
              <span
                className="ui-chart-legend__swatch"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <span>{s.label}</span>
            </>
          );
          return isButton ? (
            <button key={s.id} type="button" {...commonProps}>
              {content}
            </button>
          ) : (
            <span key={s.id} {...commonProps}>
              {content}
            </span>
          );
        })}
      </div>
    );
  },
);
