import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./KanbanLayout.css";

export interface KanbanColumn {
  id: string;
  title: ReactNode;
  cards: ReactNode[];
  wipLimit?: number;
}

export interface KanbanLayoutProps extends HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
  renderColumn?: (column: KanbanColumn) => ReactNode;
  toolbar?: ReactNode;
  label?: string;
}

export const KanbanLayout = forwardRef<HTMLDivElement, KanbanLayoutProps>(
  function KanbanLayout(
    {
      columns,
      renderColumn,
      toolbar,
      label = "Kanban board",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-kanban-layout", className].filter(Boolean).join(" ");
    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {toolbar && <div className="ui-kanban-layout__toolbar">{toolbar}</div>}
        <div className="ui-kanban-layout__columns">
          {columns.map((column) => (
            <div key={column.id} className="ui-kanban-layout__column">
              {renderColumn ? (
                renderColumn(column)
              ) : (
                <>
                  <div className="ui-kanban-layout__column-header">
                    <span className="ui-kanban-layout__column-title">
                      {column.title}
                    </span>
                    {column.wipLimit !== undefined && (
                      <span
                        className="ui-kanban-layout__column-count"
                        aria-label={`${column.cards.length} of ${column.wipLimit}`}
                      >
                        {column.cards.length} / {column.wipLimit}
                      </span>
                    )}
                  </div>
                  <div className="ui-kanban-layout__column-cards">
                    {column.cards.map((card, i) => (
                      <div key={i} className="ui-kanban-layout__card">
                        {card}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
