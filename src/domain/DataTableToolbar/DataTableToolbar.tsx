import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Button } from "../../components/Button";
import { Menu } from "../../components/Menu";
import { SearchInput } from "../../components/SearchInput";
import "./DataTableToolbar.css";

// Composition: the `filters` slot accepts one or more `FilterChip` elements
// from the consumer — see design/components/domain/DataTableToolbar.md.

export interface DataTableToolbarSearch {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

export interface DataTableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  search?: DataTableToolbarSearch;
  /** Slot for active `FilterChip` elements rendered by the consumer. */
  filters?: ReactNode;
  primaryActions?: ReactNode;
  secondaryActions?: ReactNode;
  overflowActions?: ReactNode;
}

export const DataTableToolbar = forwardRef<HTMLDivElement, DataTableToolbarProps>(
  function DataTableToolbar(
    {
      search,
      filters,
      primaryActions,
      secondaryActions,
      overflowActions,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-data-table-toolbar", className].filter(Boolean).join(" ");

    return (
      <Box
        as="div"
        ref={ref}
        role="toolbar"
        aria-label="Table toolbar"
        className={classes}
        direction="row"
        align="center"
        gap="2"
        justify="between"
        wrap
        {...rest}
      >
        {search && (
          <SearchInput
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder ?? "Search…"}
            size="sm"
            className="ui-data-table-toolbar__search"
          />
        )}
        {filters && (
          <Box
            direction="row"
            gap="1"
            align="center"
            wrap
            className="ui-data-table-toolbar__filters"
          >
            {filters}
          </Box>
        )}
        <Box direction="row" gap="1" align="center" className="ui-data-table-toolbar__actions">
          {primaryActions}
          {secondaryActions}
          {overflowActions && (
            <Menu>
              <Menu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="more-horizontal"
                  aria-label="More actions"
                />
              </Menu.Trigger>
              <Menu.List>{overflowActions}</Menu.List>
            </Menu>
          )}
        </Box>
      </Box>
    );
  },
);
