import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Table } from "../../components/Table";
import { Checkbox } from "../../components/Checkbox";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { Pagination } from "../../components/Pagination";
import { Box } from "../../primitives/Box";
import type {
  DataTableStateProps,
  SortState,
} from "./useDataTableState";
import "./DataTable.css";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  accessor?: keyof T | ((row: T) => ReactNode);
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  width?: string | number;
}

export interface DataTableProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  emptyState?: ReactNode;
  selectable?: boolean;
  total?: number;
  sort?: SortState | null;
  onSortChange?: DataTableStateProps["onSortChange"];
  pagination?: DataTableStateProps["pagination"];
  onPageChange?: DataTableStateProps["onPageChange"];
  selected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  toolbar?: ReactNode;
}

function getCellValue<T>(row: T, col: DataTableColumn<T>): ReactNode {
  if (col.render) return col.render(row);
  if (typeof col.accessor === "function") return col.accessor(row);
  if (col.accessor) {
    const v = row[col.accessor];
    return v as ReactNode;
  }
  return null;
}

function DataTableInner<T>(
  {
    columns,
    data,
    rowKey,
    loading,
    error,
    onRetry,
    emptyState,
    selectable,
    total,
    sort,
    onSortChange,
    pagination,
    onPageChange,
    selected = [],
    onSelectedChange,
    toolbar,
    className,
    ...rest
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const classes = ["ui-data-table", className].filter(Boolean).join(" ");
  const colCount = columns.length + (selectable ? 1 : 0);
  const selectedSet = new Set(selected);

  const allSelected = data.length > 0 && data.every((r) => selectedSet.has(rowKey(r)));
  const someSelected = data.some((r) => selectedSet.has(rowKey(r))) && !allSelected;

  const toggleAll = () => {
    if (!onSelectedChange) return;
    if (allSelected) {
      const dataKeys = new Set(data.map(rowKey));
      onSelectedChange(selected.filter((id) => !dataKeys.has(id)));
    } else {
      const next = new Set(selected);
      for (const r of data) next.add(rowKey(r));
      onSelectedChange(Array.from(next));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectedChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange(Array.from(next));
  };

  return (
    <Box
      ref={ref as React.Ref<HTMLElement>}
      className={classes}
      display="flex"
      direction="column"
      gap="2"
      {...rest}
    >
      {toolbar}
      {error ? (
        <ErrorState
          title="Failed to load"
          description={typeof error === "string" ? error : error.message}
          onRetry={onRetry}
        />
      ) : (
        <div className="ui-data-table__scroll">
          <Table>
            <Table.Header>
              <Table.Row>
                {selectable && (
                  <Table.Head className="ui-data-table__checkbox-head">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </Table.Head>
                )}
                {columns.map((col) => (
                  <Table.Head
                    key={col.id}
                    numeric={col.numeric}
                    sortable={col.sortable}
                    sorted={sort?.column === col.id ? sort.direction : false}
                    onSort={
                      col.sortable && onSortChange
                        ? () => onSortChange(col.id)
                        : undefined
                    }
                    width={col.width}
                  >
                    {col.header}
                  </Table.Head>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Row key={`skeleton-${i}`}>
                    {selectable && (
                      <Table.Cell>
                        <Skeleton width={16} height={16} />
                      </Table.Cell>
                    )}
                    {columns.map((col) => (
                      <Table.Cell key={col.id} numeric={col.numeric}>
                        <Skeleton width="80%" height={16} />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : data.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={colCount} className="ui-data-table__empty-cell">
                    {emptyState ?? <EmptyState title="No results" />}
                  </Table.Cell>
                </Table.Row>
              ) : (
                data.map((row) => {
                  const id = rowKey(row);
                  const isSelected = selectedSet.has(id);
                  return (
                    <Table.Row
                      key={id}
                      aria-selected={selectable ? isSelected : undefined}
                      className={isSelected ? "ui-data-table__row--selected" : undefined}
                    >
                      {selectable && (
                        <Table.Cell>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleRow(id)}
                            aria-label={`Select row ${id}`}
                          />
                        </Table.Cell>
                      )}
                      {columns.map((col) => (
                        <Table.Cell key={col.id} numeric={col.numeric}>
                          {getCellValue(row, col)}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table>
        </div>
      )}
      {pagination && onPageChange && total != null && total > pagination.pageSize && (
        <Pagination
          page={pagination.page}
          totalPages={Math.max(1, Math.ceil(total / pagination.pageSize))}
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
}

export const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof DataTableInner>;
