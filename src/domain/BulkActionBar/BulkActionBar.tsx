import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { formatNumber } from "../../utils";
import type { IconName } from "../../primitives/Icon";
import "./BulkActionBar.css";

/** Legacy action descriptor — retained for callers still passing an array. */
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
  totalCount?: number;
  onClearSelection?: () => void;
  /** Legacy alias for `onClearSelection`. */
  onClear?: () => void;
  clearLabel?: string;
  /** Action slot (ReactNode) or legacy array of {id,label,onSelect}. */
  actions?: ReactNode | BulkAction[];
  sticky?: boolean;
}

function isActionArray(a: unknown): a is BulkAction[] {
  return (
    Array.isArray(a) &&
    a.every(
      (x) =>
        !!x &&
        typeof x === "object" &&
        "id" in x &&
        "label" in x &&
        "onSelect" in x,
    )
  );
}

export const BulkActionBar = forwardRef<HTMLDivElement, BulkActionBarProps>(
  function BulkActionBar(
    {
      selectedCount,
      totalCount,
      onClearSelection,
      onClear,
      clearLabel = "Clear selection",
      actions,
      sticky = true,
      className,
      ...rest
    },
    ref,
  ) {
    if (selectedCount <= 0) return null;
    const clear = onClearSelection ?? onClear;
    const classes = [
      "ui-bulk-action-bar",
      sticky && "ui-bulk-action-bar--sticky",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const countCopy =
      typeof totalCount === "number"
        ? `${formatNumber(selectedCount)} of ${formatNumber(totalCount)} selected`
        : `${formatNumber(selectedCount)} selected`;

    const renderedActions = isActionArray(actions)
      ? actions.map((a) => (
          <Button
            key={a.id}
            variant={a.destructive ? "destructive" : "secondary"}
            size="sm"
            icon={a.icon}
            disabled={a.disabled}
            onClick={a.onSelect}
          >
            {a.label}
          </Button>
        ))
      : actions;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        role="region"
        aria-label="Bulk actions"
        aria-live="polite"
        direction="row"
        align="center"
        justify="between"
        gap="3"
        className={classes}
        {...rest}
      >
        <Text as="span" size="body" weight="medium" className="ui-bulk-action-bar__count">
          {countCopy}
        </Text>
        <Box direction="row" align="center" gap="2" className="ui-bulk-action-bar__actions">
          {renderedActions}
          {clear && (
            <Button
              variant="ghost"
              size="sm"
              aria-label={clearLabel}
              onClick={clear}
            >
              {clearLabel}
            </Button>
          )}
        </Box>
      </Box>
    );
  },
);

BulkActionBar.displayName = "BulkActionBar";
