import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./PivotLayout.css";

export interface PivotLayoutProps extends HTMLAttributes<HTMLDivElement> {
  rowHeaders: ReactNode;
  columnHeaders: ReactNode;
  cells: ReactNode;
  cornerCell?: ReactNode;
  label?: string;
}

export const PivotLayout = forwardRef<HTMLDivElement, PivotLayoutProps>(
  function PivotLayout(
    {
      rowHeaders,
      columnHeaders,
      cells,
      cornerCell,
      label = "Pivot table",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-pivot-layout", className].filter(Boolean).join(" ");
    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        <div className="ui-pivot-layout__corner">{cornerCell}</div>
        <div className="ui-pivot-layout__column-headers">{columnHeaders}</div>
        <div className="ui-pivot-layout__row-headers">{rowHeaders}</div>
        <div className="ui-pivot-layout__cells">{cells}</div>
      </div>
    );
  },
);
