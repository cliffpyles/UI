import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Button } from "../../components/Button";
// Toggle uses Button's `icon` prop, which renders an Icon internally.
import "./ExpandableRow.css";

export interface ExpandableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, "onToggle"> {
  expanded: boolean;
  onToggle: (next: boolean) => void;
  expandedContent: ReactNode;
  toggleLabel?: string;
  colSpan: number;
  children: ReactNode;
  disabled?: boolean;
}

export const ExpandableRow = forwardRef<HTMLTableRowElement, ExpandableRowProps>(
  function ExpandableRow(
    {
      expanded,
      onToggle,
      expandedContent,
      toggleLabel,
      colSpan,
      children,
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) {
    const reactId = useId();
    const panelId = `${id ?? reactId}-panel`;

    const classes = [
      "ui-expandable-row",
      expanded && "ui-expandable-row--expanded",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const label =
      toggleLabel ?? (expanded ? "Collapse row" : "Expand row");

    return (
      <>
        <tr ref={ref} className={classes} id={id} {...rest}>
          <td className="ui-expandable-row__toggle-cell">
            <Box display="flex" align="center" gap="1">
              <Button
                variant="ghost"
                size="sm"
                icon={expanded ? "chevron-down" : "chevron-right"}
                disabled={disabled}
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-label={label}
                onClick={() => onToggle(!expanded)}
              />
            </Box>
          </td>
          {children}
        </tr>
        {expanded && (
          <tr
            id={panelId}
            role="row"
            className="ui-expandable-row__detail"
          >
            <td colSpan={colSpan} className="ui-expandable-row__content">
              <Box direction="column" gap="0">
                {expandedContent}
              </Box>
            </td>
          </tr>
        )}
      </>
    );
  },
);
