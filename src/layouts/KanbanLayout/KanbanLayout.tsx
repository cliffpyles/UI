import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
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
      <Box
        ref={ref as Ref<HTMLElement>}
        direction="column"
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {toolbar && (
          <Box
            align="center"
            gap="content"
            className="ui-kanban-layout__toolbar"
          >
            {toolbar}
          </Box>
        )}
        <Box gap="content" className="ui-kanban-layout__columns">
          {columns.map((column) => (
            <Box
              key={column.id}
              direction="column"
              className="ui-kanban-layout__column"
            >
              {renderColumn ? (
                renderColumn(column)
              ) : (
                <>
                  <Box
                    align="center"
                    justify="between"
                    gap="inline"
                    className="ui-kanban-layout__column-header"
                  >
                    <Text
                      as="span"
                      weight="semibold"
                      color="primary"
                      className="ui-kanban-layout__column-title"
                    >
                      {column.title}
                    </Text>
                    {column.wipLimit !== undefined && (
                      <Text
                        as="span"
                        color="secondary"
                        className="ui-kanban-layout__column-count"
                        aria-label={`${column.cards.length} of ${column.wipLimit}`}
                      >
                        {column.cards.length} / {column.wipLimit}
                      </Text>
                    )}
                  </Box>
                  <Box
                    direction="column"
                    gap="inline"
                    className="ui-kanban-layout__column-cards"
                  >
                    {column.cards.map((card, i) => (
                      <div key={i} className="ui-kanban-layout__card">
                        {card}
                      </div>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
  },
);
