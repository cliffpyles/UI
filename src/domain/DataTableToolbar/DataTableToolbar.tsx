import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../../components/Button";
import { SearchInput } from "../../components/SearchInput";
import { Icon } from "../../primitives/Icon";
import "./DataTableToolbar.css";

export interface DataTableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  filters?: ReactNode;
  onExport?: () => void;
  columnPicker?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const DataTableToolbar = forwardRef<HTMLDivElement, DataTableToolbarProps>(
  function DataTableToolbar(
    {
      onSearch,
      searchValue,
      searchPlaceholder = "Search…",
      filters,
      onExport,
      columnPicker,
      leading,
      trailing,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-data-table-toolbar", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="toolbar" aria-label="Table toolbar" {...rest}>
        {leading && <div className="ui-data-table-toolbar__leading">{leading}</div>}
        {onSearch && (
          <SearchInput
            value={searchValue}
            onChange={onSearch}
            placeholder={searchPlaceholder}
            size="sm"
          />
        )}
        {filters && <div className="ui-data-table-toolbar__filters">{filters}</div>}
        <div className="ui-data-table-toolbar__spacer" />
        {trailing}
        {columnPicker}
        {onExport && (
          <Button variant="secondary" size="sm" onClick={onExport}>
            <Icon name="download" size="xs" aria-hidden /> Export
          </Button>
        )}
      </div>
    );
  },
);
