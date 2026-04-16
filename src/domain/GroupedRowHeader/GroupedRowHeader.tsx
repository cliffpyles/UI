import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import "./GroupedRowHeader.css";

export interface GroupedRowHeaderProps extends HTMLAttributes<HTMLTableRowElement> {
  group: ReactNode;
  count?: number;
  aggregates?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  colSpan: number;
}

export const GroupedRowHeader = forwardRef<HTMLTableRowElement, GroupedRowHeaderProps>(
  function GroupedRowHeader(
    { group, count, aggregates, expanded = true, onToggle, colSpan, className, ...rest },
    ref,
  ) {
    const classes = ["ui-grouped-row-header", className].filter(Boolean).join(" ");

    return (
      <tr ref={ref} className={classes} {...rest}>
        <th scope="colgroup" colSpan={colSpan} className="ui-grouped-row-header__cell">
          <div className="ui-grouped-row-header__inner">
            {onToggle && (
              <button
                type="button"
                className="ui-grouped-row-header__toggle"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse group" : "Expand group"}
              >
                <Icon name={expanded ? "chevron-down" : "chevron-right"} size="sm" aria-hidden />
              </button>
            )}
            <span className="ui-grouped-row-header__label">{group}</span>
            {count != null && (
              <span className="ui-grouped-row-header__count">{count}</span>
            )}
            {aggregates && (
              <span className="ui-grouped-row-header__aggregates">{aggregates}</span>
            )}
          </div>
        </th>
      </tr>
    );
  },
);
