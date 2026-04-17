import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import "./FilterBarLayout.css";

export interface FilterBarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  filters: ReactNode[];
  onClearAll?: () => void;
  showClearAll?: boolean;
  actions?: ReactNode;
  clearAllLabel?: string;
  ariaLabel?: string;
}

export const FilterBarLayout = forwardRef<HTMLDivElement, FilterBarLayoutProps>(
  function FilterBarLayout(
    {
      filters,
      onClearAll,
      showClearAll = true,
      actions,
      clearAllLabel = "Clear all",
      ariaLabel = "Filters",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-filter-bar", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        role="toolbar"
        aria-label={ariaLabel}
        align="center"
        gap="content"
        paddingX="page"
        paddingY="content"
        className={classes}
        {...rest}
      >
        <Box
          align="center"
          gap="content"
          grow
          minWidth={0}
          className="ui-filter-bar__filters"
        >
          {filters.map((filter, index) => (
            <div
              key={index}
              className="ui-filter-bar__filter"
            >
              {filter}
            </div>
          ))}
        </Box>
        <Box align="center" gap="content" shrink={0}>
          {showClearAll && onClearAll && (
            <button
              type="button"
              className="ui-filter-bar__clear"
              onClick={onClearAll}
            >
              {clearAllLabel}
            </button>
          )}
          {actions && (
            <Box align="center" gap="content">
              {actions}
            </Box>
          )}
        </Box>
      </Box>
    );
  },
);
