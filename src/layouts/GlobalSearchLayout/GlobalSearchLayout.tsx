import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./GlobalSearchLayout.css";

export interface GlobalSearchCategory {
  id: string;
  label: string;
  items: ReactNode[];
}

export interface GlobalSearchLayoutProps extends HTMLAttributes<HTMLDivElement> {
  searchInput: ReactNode;
  categories: GlobalSearchCategory[];
  recents?: ReactNode;
  empty?: ReactNode;
  ariaLabel?: string;
}

export const GlobalSearchLayout = forwardRef<HTMLDivElement, GlobalSearchLayoutProps>(
  function GlobalSearchLayout(
    {
      searchInput,
      categories,
      recents,
      empty,
      ariaLabel = "Global search",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-global-search", className].filter(Boolean).join(" ");
    const hasResults = categories.some((c) => c.items.length > 0);
    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        direction="column"
        role="search"
        aria-label={ariaLabel}
        className={classes}
        {...rest}
      >
        <div className="ui-global-search__input">{searchInput}</div>
        <Box direction="column" gap="section" className="ui-global-search__body">
          {!hasResults && recents && (
            <div className="ui-global-search__recents">{recents}</div>
          )}
          {!hasResults && !recents && empty && (
            <div className="ui-global-search__empty">{empty}</div>
          )}
          {hasResults &&
            categories.map((category) => (
              <section
                key={category.id}
                className="ui-global-search__category"
                aria-label={category.label}
              >
                <Text
                  as="h3"
                  size="base"
                  color="secondary"
                  className="ui-global-search__category-label"
                >
                  {category.label}
                </Text>
                <ul className="ui-global-search__items">
                  {category.items.map((item, index) => (
                    <li
                      key={index}
                      className="ui-global-search__item"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </Box>
      </Box>
    );
  },
);
