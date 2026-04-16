import { forwardRef, useCallback, type HTMLAttributes } from "react";
import "./Pagination.css";

interface PaginationOwnProps {
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the page changes */
  onPageChange: (page: number) => void;
  /** Current page size */
  pageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Called when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Total number of items (for "Showing X-Y of Z" label) */
  totalItems?: number;
}

export type PaginationProps = PaginationOwnProps &
  Omit<HTMLAttributes<HTMLElement>, "onChange">;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      page,
      totalPages,
      onPageChange,
      pageSize,
      pageSizeOptions = [10, 25, 50, 100],
      onPageSizeChange,
      totalItems,
      className,
      ...props
    },
    ref,
  ) {
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;

    const goFirst = useCallback(() => {
      if (!isFirstPage) onPageChange(1);
    }, [isFirstPage, onPageChange]);

    const goPrev = useCallback(() => {
      if (!isFirstPage) onPageChange(page - 1);
    }, [isFirstPage, onPageChange, page]);

    const goNext = useCallback(() => {
      if (!isLastPage) onPageChange(page + 1);
    }, [isLastPage, onPageChange, page]);

    const goLast = useCallback(() => {
      if (!isLastPage) onPageChange(totalPages);
    }, [isLastPage, onPageChange, totalPages]);

    const handlePageSizeChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPageSizeChange?.(Number(e.target.value));
      },
      [onPageSizeChange],
    );

    // Calculate "Showing X-Y of Z"
    const showingLabel = (() => {
      if (totalItems === undefined || pageSize === undefined) return null;
      const start = (page - 1) * pageSize + 1;
      const end = Math.min(page * pageSize, totalItems);
      return `Showing ${start}\u2013${end} of ${totalItems}`;
    })();

    const classes = ["ui-pagination", className].filter(Boolean).join(" ");

    return (
      <nav ref={ref} aria-label="Pagination" className={classes} {...props}>
        {showingLabel && (
          <span className="ui-pagination__info">{showingLabel}</span>
        )}

        {pageSize !== undefined && onPageSizeChange && (
          <div className="ui-pagination__page-size">
            <label className="ui-pagination__page-size-label">
              Rows per page:
              <select
                className="ui-pagination__page-size-select"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="ui-pagination__controls">
          <button
            type="button"
            className="ui-pagination__button"
            onClick={goFirst}
            disabled={isFirstPage}
            aria-label="First page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
          <button
            type="button"
            className="ui-pagination__button"
            onClick={goPrev}
            disabled={isFirstPage}
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className="ui-pagination__page-indicator">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            className="ui-pagination__button"
            onClick={goNext}
            disabled={isLastPage}
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            type="button"
            className="ui-pagination__button"
            onClick={goLast}
            disabled={isLastPage}
            aria-label="Last page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        </div>
      </nav>
    );
  },
);
