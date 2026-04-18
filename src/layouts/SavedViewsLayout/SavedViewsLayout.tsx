import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import "./SavedViewsLayout.css";

export interface SavedView {
  id: string;
  name: string;
  description?: string;
}

export interface SavedViewHandlers {
  onSelect?: () => void;
  onDelete?: () => void;
}

export type SavedViewsMode = "list" | "grid";

export interface SavedViewsLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  views: SavedView[];
  view?: SavedViewsMode;
  renderView?: (view: SavedView, handlers: SavedViewHandlers) => ReactNode;
  onSelectView?: (view: SavedView) => void;
  onDeleteView?: (view: SavedView) => void;
  onCreate?: () => void;
  createLabel?: string;
  header?: ReactNode;
  empty?: ReactNode;
  ariaLabel?: string;
}

export const SavedViewsLayout = forwardRef<HTMLDivElement, SavedViewsLayoutProps>(
  function SavedViewsLayout(
    {
      views,
      view = "list",
      renderView,
      onSelectView,
      onDeleteView,
      onCreate,
      createLabel = "New view",
      header,
      empty,
      ariaLabel = "Saved views",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = [
      "ui-saved-views",
      `ui-saved-views--${view}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div ref={ref} className={classes} {...rest}>
        <header className="ui-saved-views__header">
          <div className="ui-saved-views__header-content">{header}</div>
          {onCreate && (
            <Button
              variant="ghost"
              size="sm"
              className="ui-saved-views__create"
              onClick={onCreate}
            >
              {createLabel}
            </Button>
          )}
        </header>
        {views.length === 0 && empty ? (
          <div className="ui-saved-views__empty">{empty}</div>
        ) : (
          <ul
            className="ui-saved-views__list"
            aria-label={ariaLabel}
          >
            {views.map((v) => {
              const handlers: SavedViewHandlers = {
                onSelect: onSelectView ? () => onSelectView(v) : undefined,
                onDelete: onDeleteView ? () => onDeleteView(v) : undefined,
              };
              return (
                <li key={v.id} className="ui-saved-views__item">
                  {renderView ? (
                    renderView(v, handlers)
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ui-saved-views__default"
                      onClick={handlers.onSelect}
                    >
                      <Box direction="column" gap="0.5">
                        <Text as="span" weight="semibold" className="ui-saved-views__name">
                          {v.name}
                        </Text>
                        {v.description && (
                          <Text as="span" color="secondary" className="ui-saved-views__description">
                            {v.description}
                          </Text>
                        )}
                      </Box>
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
