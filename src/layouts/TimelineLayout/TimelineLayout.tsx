import { forwardRef, type HTMLAttributes, type ReactNode, type CSSProperties } from "react";
import "./TimelineLayout.css";

export interface TimelineLayoutRow {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TimelineLayoutProps extends HTMLAttributes<HTMLDivElement> {
  rows: TimelineLayoutRow[];
  timeAxis: ReactNode;
  labelWidth?: number;
  label?: string;
}

export const TimelineLayout = forwardRef<HTMLDivElement, TimelineLayoutProps>(
  function TimelineLayout(
    {
      rows,
      timeAxis,
      labelWidth = 160,
      label = "Timeline",
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-timeline-layout", className].filter(Boolean).join(" ");
    const styles = {
      ...style,
      "--ui-timeline-label-width": `${labelWidth}px`,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        style={styles}
        {...rest}
      >
        <div className="ui-timeline-layout__labels">
          <div className="ui-timeline-layout__labels-spacer" aria-hidden="true" />
          {rows.map((row) => (
            <div key={row.id} className="ui-timeline-layout__label">
              {row.label}
            </div>
          ))}
        </div>
        <div className="ui-timeline-layout__scroll">
          <div className="ui-timeline-layout__axis">{timeAxis}</div>
          <div className="ui-timeline-layout__rows">
            {rows.map((row) => (
              <div key={row.id} className="ui-timeline-layout__row">
                {row.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
