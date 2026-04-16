import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import "./ExpandableRow.css";

export interface ExpandableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, "content"> {
  expanded: boolean;
  onToggle: () => void;
  content: ReactNode;
  colSpan: number;
  children: ReactNode;
}

export const ExpandableRow = forwardRef<HTMLTableRowElement, ExpandableRowProps>(
  function ExpandableRow(
    { expanded, onToggle, content, colSpan, children, className, ...rest },
    ref,
  ) {
    const classes = ["ui-expandable-row", expanded && "ui-expandable-row--expanded", className]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        <tr ref={ref} className={classes} {...rest}>
          <td className="ui-expandable-row__toggle-cell">
            <button
              type="button"
              className="ui-expandable-row__toggle"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse row" : "Expand row"}
            >
              <Icon
                name={expanded ? "chevron-down" : "chevron-right"}
                size="sm"
                aria-hidden
              />
            </button>
          </td>
          {children}
        </tr>
        {expanded && (
          <tr className="ui-expandable-row__detail">
            <td colSpan={colSpan + 1} className="ui-expandable-row__content">
              {content}
            </td>
          </tr>
        )}
      </>
    );
  },
);
