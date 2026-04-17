import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import "./DashboardFrame.css";

export interface DashboardWidget {
  id: string;
  span?: number;
  rowSpan?: number;
  content: ReactNode;
}

export interface DashboardFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  widgets: DashboardWidget[];
  columns?: number;
  gap?: string;
  filterBar?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
}

export const DashboardFrame = forwardRef<HTMLDivElement, DashboardFrameProps>(
  function DashboardFrame(
    {
      widgets,
      columns = 12,
      gap,
      filterBar,
      title,
      actions,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-dashboard-frame", className].filter(Boolean).join(" ");
    return (
      <div
        ref={ref}
        className={classes}
        style={{
          ["--ui-dashboard-columns" as string]: columns,
          ...(gap ? { ["--ui-dashboard-gap" as string]: gap } : {}),
          ...style,
        }}
        {...rest}
      >
        {(title || actions) && (
          <Box
            as="header"
            className="ui-dashboard-frame__header"
            display="flex"
            align="center"
            justify="between"
            gap="3"
          >
            {title && <div className="ui-dashboard-frame__title">{title}</div>}
            {actions && (
              <Box
                className="ui-dashboard-frame__actions"
                display="flex"
                align="center"
                gap="2"
              >
                {actions}
              </Box>
            )}
          </Box>
        )}
        {filterBar && (
          <div className="ui-dashboard-frame__filter-bar">{filterBar}</div>
        )}
        <div className="ui-dashboard-frame__grid">
          {widgets.map((w) => (
            <div
              key={w.id}
              className="ui-dashboard-frame__widget"
              style={{
                gridColumn: `span ${Math.min(w.span ?? columns, columns)}`,
                gridRow: w.rowSpan ? `span ${w.rowSpan}` : undefined,
              }}
            >
              {w.content}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
