import { useCallback, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export type SortState = { column: string; direction: SortDirection } | null;

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface DataTableStateOptions {
  defaultSort?: SortState;
  defaultPageSize?: number;
  defaultSelected?: string[];
}

export interface DataTableStateProps {
  sort: SortState | null;
  onSortChange: (column: string) => void;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
}

export interface DataTableStateResult {
  props: DataTableStateProps;
  sort: SortState | null;
  pagination: PaginationState;
  selected: string[];
  setSelected: (ids: string[]) => void;
  resetPagination: () => void;
}

export function useDataTableState(
  options: DataTableStateOptions = {},
): DataTableStateResult {
  const { defaultSort = null, defaultPageSize = 25, defaultSelected = [] } = options;

  const [sort, setSort] = useState<SortState | null>(defaultSort);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: defaultPageSize,
  });
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  const onSortChange = useCallback((column: string) => {
    setSort((prev) => {
      if (!prev || prev.column !== column) return { column, direction: "asc" };
      if (prev.direction === "asc") return { column, direction: "desc" };
      return null;
    });
  }, []);

  const onPageChange = useCallback((page: number) => {
    setPagination((p) => ({ ...p, page }));
  }, []);

  const onPageSizeChange = useCallback((pageSize: number) => {
    setPagination({ page: 1, pageSize });
  }, []);

  const resetPagination = useCallback(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, []);

  const props = useMemo<DataTableStateProps>(
    () => ({
      sort,
      onSortChange,
      pagination,
      onPageChange,
      onPageSizeChange,
      selected,
      onSelectedChange: setSelected,
    }),
    [sort, pagination, selected, onSortChange, onPageChange, onPageSizeChange],
  );

  return { props, sort, pagination, selected, setSelected, resetPagination };
}
