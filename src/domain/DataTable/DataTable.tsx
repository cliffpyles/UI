import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Table } from "../../components/Table";
import { Checkbox } from "../../components/Checkbox";
import { Skeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { Pagination } from "../../components/Pagination";
import type { SortState } from "./useDataTableState";
import "./DataTable.css";

export type { SortState };

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  width?: string | number;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  emptyState?: ReactNode;
  sort?: SortState;
  onSortChange?: (next: SortState) => void;
  selection?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  pagination?: DataTablePagination;
  visibleColumns?: string[];
  toolbar?: ReactNode;
}

function nextSort(current: SortState, column: string): SortState {
  if (!current || current.column !== column) return { column, direction: "asc" };
  if (current.direction === "asc") return { column, direction: "desc" };
  return null;
}

function DataTableInner<T>(
  {
    columns,
    rows,
    rowKey,
    loading = false,
    error,
    onRetry,
    emptyState,
    sort = null,
    onSortChange,
    selection,
    onSelectionChange,
    pagination,
    visibleColumns,
    toolbar,
    className,
    ...rest
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const classes = ["ui-data-table", className].filter(Boolean).join(" ");
  const selectable = !!selection && !!onSelectionChange;
  const selectionSet = selection ?? new Set<string>();

  const activeColumns = visibleColumns
    ? visibleColumns
        .map((id) => columns.find((c) => c.id === id))
        .filter((c): c is DataTableColumn<T> => !!c)
    : columns;

  const colCount = activeColumns.length + (selectable ? 1 : 0);
  const skeletonCount = pagination?.pageSize ?? 5;

  const allSelected = rows.length > 0 && rows.every((r) => selectionSet.has(rowKey(r)));
  const someSelected = rows.some((r) => selectionSet.has(rowKey(r))) && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const next = new Set(selectionSet);
    if (allSelected) {
      for (const r of rows) next.delete(rowKey(r));
    } else {
      for (const r of rows) next.add(rowKey(r));
    }
    onSelectionChange(next);
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectionSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const handleHeaderSort = (column: string) => {
    if (!onSortChange) return;
    onSortChange(nextSort(sort, column));
  };

  return (
    <Box
      ref={ref as React.Ref<HTMLElement>}
      className={classes}
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
          <Table aria-busy={loading || undefined}>
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
                {activeColumns.map((col) => (
                  <Table.Head
                    key={col.id}
                    numeric={col.numeric}
                    sortable={col.sortable}
                    sorted={sort?.column === col.id ? sort.direction : false}
                    onSort={
                      col.sortable && onSortChange
                        ? () => handleHeaderSort(col.id)
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
                Array.from({ length: skeletonCount }).map((_, i) => (
                  <Table.Row key={`skeleton-${i}`}>
                    {selectable && (
                      <Table.Cell>
                        <Skeleton width={16} height={16} />
                      </Table.Cell>
                    )}
                    {activeColumns.map((col) => (
                      <Table.Cell key={col.id} numeric={col.numeric}>
                        <Skeleton width="80%" height={16} />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : rows.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={colCount} className="ui-data-table__empty-cell">
                    {emptyState ?? <EmptyState title="No results" />}
                  </Table.Cell>
                </Table.Row>
              ) : (
                rows.map((row) => {
                  const id = rowKey(row);
                  const isSelected = selectionSet.has(id);
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
                      {activeColumns.map((col) => (
                        <Table.Cell key={col.id} numeric={col.numeric}>
                          {col.accessor(row)}
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
      {pagination && pagination.total > pagination.pageSize && (
        <Pagination
          page={pagination.page}
          totalPages={Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
          onPageChange={pagination.onPageChange}
        />
      )}
    </Box>
  );
}

export const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof DataTableInner>;
