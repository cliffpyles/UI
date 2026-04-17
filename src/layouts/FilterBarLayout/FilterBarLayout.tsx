import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
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
      <div
        ref={ref}
        role="toolbar"
        aria-label={ariaLabel}
        className={classes}
        {...rest}
      >
        <div className="ui-filter-bar__filters">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="ui-filter-bar__filter"
            >
              {filter}
            </div>
          ))}
        </div>
        <div className="ui-filter-bar__trailing">
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
            <div className="ui-filter-bar__actions">{actions}</div>
          )}
        </div>
      </div>
    );
  },
);
