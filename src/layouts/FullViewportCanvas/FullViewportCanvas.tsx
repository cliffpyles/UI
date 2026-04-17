import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./FullViewportCanvas.css";

export interface FullViewportCanvasProps extends HTMLAttributes<HTMLDivElement> {
  canvas: ReactNode;
  overlay?: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
}

export const FullViewportCanvas = forwardRef<HTMLDivElement, FullViewportCanvasProps>(
  function FullViewportCanvas(
    { canvas, overlay, topLeft, topRight, bottomLeft, bottomRight, className, ...rest },
    ref,
  ) {
    const classes = ["ui-full-viewport-canvas", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-full-viewport-canvas__canvas">{canvas}</div>
        {topLeft && (
          <div className="ui-full-viewport-canvas__slot ui-full-viewport-canvas__slot--tl">
            {topLeft}
          </div>
        )}
        {topRight && (
          <div className="ui-full-viewport-canvas__slot ui-full-viewport-canvas__slot--tr">
            {topRight}
          </div>
        )}
        {bottomLeft && (
          <div className="ui-full-viewport-canvas__slot ui-full-viewport-canvas__slot--bl">
            {bottomLeft}
          </div>
        )}
        {bottomRight && (
          <div className="ui-full-viewport-canvas__slot ui-full-viewport-canvas__slot--br">
            {bottomRight}
          </div>
        )}
        {overlay && (
          <div className="ui-full-viewport-canvas__overlay">{overlay}</div>
        )}
      </div>
    );
  },
);
