import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Grid } from "../../primitives/Grid";
import "./CardListLayout.css";

export type CardListView = "grid" | "list";

export interface CardListLayoutProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  view?: CardListView;
  toolbar?: ReactNode;
  emptyState?: ReactNode;
  getKey?: (item: T, index: number) => string | number;
  label?: string;
}

function CardListLayoutInner<T>(
  {
    items,
    renderCard,
    view = "grid",
    toolbar,
    emptyState,
    getKey,
    label = "Card list",
    className,
    ...rest
  }: CardListLayoutProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const classes = [
    "ui-card-list",
    `ui-card-list--${view}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isEmpty = items.length === 0;

  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      direction="column"
      gap="content"
      padding="page"
      className={classes}
      role="region"
      aria-label={label}
      {...rest}
    >
      {toolbar && (
        <Box align="center" gap="content" className="ui-card-list__toolbar">
          {toolbar}
        </Box>
      )}
      {isEmpty ? (
        <Box align="center" justify="center" className="ui-card-list__empty">
          {emptyState}
        </Box>
      ) : (
        <Grid gap="content" className="ui-card-list__items">
          {items.map((item, i) => (
            <div
              key={getKey ? getKey(item, i) : i}
              className="ui-card-list__item"
            >
              {renderCard(item, i)}
            </div>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export const CardListLayout = forwardRef(CardListLayoutInner) as <T>(
  props: CardListLayoutProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof CardListLayoutInner>;
