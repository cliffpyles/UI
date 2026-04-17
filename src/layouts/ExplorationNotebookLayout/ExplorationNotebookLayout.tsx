import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./ExplorationNotebookLayout.css";

export interface NotebookCell {
  id: string;
  content: ReactNode;
}

export interface NotebookCellHandlers {
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export interface ExplorationNotebookLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  cells: NotebookCell[];
  onAddCell?: (index: number) => void;
  onRemoveCell?: (id: string) => void;
  onReorder?: (from: number, to: number) => void;
  renderCell?: (cell: NotebookCell, handlers: NotebookCellHandlers) => ReactNode;
  addCellLabel?: string;
  ariaLabel?: string;
}

export const ExplorationNotebookLayout = forwardRef<
  HTMLDivElement,
  ExplorationNotebookLayoutProps
>(function ExplorationNotebookLayout(
  {
    cells,
    onAddCell,
    onRemoveCell,
    onReorder,
    renderCell,
    addCellLabel = "Add cell",
    ariaLabel = "Notebook",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-notebook", className].filter(Boolean).join(" ");

  const renderAdd = (index: number) =>
    onAddCell ? (
      <div className="ui-notebook__add-slot">
        <button
          type="button"
          className="ui-notebook__add"
          onClick={() => onAddCell(index)}
          aria-label={`${addCellLabel} at position ${index + 1}`}
        >
          {addCellLabel}
        </button>
      </div>
    ) : null;

  return (
    <div
      ref={ref}
      className={classes}
      aria-label={ariaLabel}
      {...rest}
    >
      {renderAdd(0)}
      <ol className="ui-notebook__cells">
        {cells.map((cell, index) => {
          const handlers: NotebookCellHandlers = {
            onRemove: onRemoveCell ? () => onRemoveCell(cell.id) : undefined,
            onMoveUp:
              onReorder && index > 0
                ? () => onReorder(index, index - 1)
                : undefined,
            onMoveDown:
              onReorder && index < cells.length - 1
                ? () => onReorder(index, index + 1)
                : undefined,
          };
          return (
            <li key={cell.id} className="ui-notebook__cell-wrapper">
              <div className="ui-notebook__cell">
                {renderCell ? (
                  renderCell(cell, handlers)
                ) : (
                  <>
                    <div className="ui-notebook__cell-content">
                      {cell.content}
                    </div>
                    {onRemoveCell && (
                      <button
                        type="button"
                        className="ui-notebook__remove"
                        onClick={handlers.onRemove}
                        aria-label="Remove cell"
                      >
                        Remove
                      </button>
                    )}
                  </>
                )}
              </div>
              {renderAdd(index + 1)}
            </li>
          );
        })}
      </ol>
    </div>
  );
});
