import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./GraphLayout.css";

export interface GraphLayoutProps extends HTMLAttributes<HTMLDivElement> {
  canvas: ReactNode;
  controls?: ReactNode;
  legend?: ReactNode;
  label?: string;
}

export const GraphLayout = forwardRef<HTMLDivElement, GraphLayoutProps>(
  function GraphLayout(
    { canvas, controls, legend, label = "Graph", className, ...rest },
    ref,
  ) {
    const classes = ["ui-graph-layout", className].filter(Boolean).join(" ");
    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        <div className="ui-graph-layout__canvas">{canvas}</div>
        {controls && (
          <div className="ui-graph-layout__controls">{controls}</div>
        )}
        {legend && <div className="ui-graph-layout__legend">{legend}</div>}
      </div>
    );
  },
);
