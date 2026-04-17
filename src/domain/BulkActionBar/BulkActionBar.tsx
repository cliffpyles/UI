import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Box } from "../../primitives/Box";
import { Icon, type IconName } from "../../primitives/Icon";
import "./BulkActionBar.css";

export interface BulkAction {
  id: string;
  label: string;
  icon?: IconName;
  destructive?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export interface BulkActionBarProps extends HTMLAttributes<HTMLDivElement> {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  itemLabel?: string;
}

export const BulkActionBar = forwardRef<HTMLDivElement, BulkActionBarProps>(
  function BulkActionBar(
    { selectedCount, actions, onClear, itemLabel = "row", className, ...rest },
    ref,
  ) {
    const classes = ["ui-bulk-action-bar", className].filter(Boolean).join(" ");
    if (selectedCount <= 0) return null;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        display="flex"
        align="center"
        gap="3"
        role="region"
        aria-label="Bulk actions"
        {...rest}
      >
        <span className="ui-bulk-action-bar__count">
          {selectedCount} {itemLabel}
          {selectedCount === 1 ? "" : "s"} selected
        </span>
        <Box className="ui-bulk-action-bar__actions" display="flex" gap="1">
          {actions.map((a) => (
            <Button
              key={a.id}
              variant={a.destructive ? "destructive" : "secondary"}
              size="sm"
              disabled={a.disabled}
              onClick={a.onSelect}
            >
              {a.icon && <Icon name={a.icon} size="xs" aria-hidden />}
              {a.label}
            </Button>
          ))}
        </Box>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </Box>
    );
  },
);
