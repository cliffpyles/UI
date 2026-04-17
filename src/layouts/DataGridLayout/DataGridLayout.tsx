import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./DataGridLayout.css";

export interface DataGridLayoutProps extends HTMLAttributes<HTMLDivElement> {
  toolbar?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  label?: string;
}

export const DataGridLayout = forwardRef<HTMLDivElement, DataGridLayoutProps>(
  function DataGridLayout(
    { toolbar, filters, children, label = "Data grid", className, ...rest },
    ref,
  ) {
    const classes = ["ui-data-grid-layout", className].filter(Boolean).join(" ");
    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {toolbar && (
          <div className="ui-data-grid-layout__toolbar">{toolbar}</div>
        )}
        {filters && (
          <div className="ui-data-grid-layout__filters">{filters}</div>
        )}
        <div className="ui-data-grid-layout__body">{children}</div>
      </div>
    );
  },
);
