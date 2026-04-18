import { forwardRef, useCallback, useId, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../Button";
import { Select } from "../Select";
import "./Pagination.css";

// Icon names (chevron-left/right/chevrons-left/chevrons-right) are passed as
// the `icon` prop to Button, which composes Icon internally per its spec.

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
    const sizeLabelId = useId();
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
      (value: string) => {
        onPageSizeChange?.(Number(value));
      },
      [onPageSizeChange],
    );

    // Calculate "Showing X–Y of Z" using en-dash per spec
    const showingLabel = (() => {
      if (totalItems === undefined || pageSize === undefined) return null;
      const start = (page - 1) * pageSize + 1;
      const end = Math.min(page * pageSize, totalItems);
      return `Showing ${start}\u2013${end} of ${totalItems}`;
    })();

    const classes = ["ui-pagination", className].filter(Boolean).join(" ");

    return (
      <Box
        as="nav"
        ref={ref as React.Ref<HTMLElement>}
        align="center"
        justify="between"
        gap="4"
        aria-label="Pagination"
        className={classes}
        {...props}
      >
        {showingLabel && (
          <Text as="span" size="sm" color="secondary" className="ui-pagination__info">
            {showingLabel}
          </Text>
        )}

        {pageSize !== undefined && onPageSizeChange && (
          <Box align="center" gap="1" className="ui-pagination__page-size">
            <Text
              as="label"
              id={sizeLabelId}
              size="sm"
              color="secondary"
              className="ui-pagination__page-size-label"
            >
              Rows per page:
            </Text>
            <Select
              size="sm"
              value={String(pageSize)}
              onChange={handlePageSizeChange}
              aria-labelledby={sizeLabelId}
              options={pageSizeOptions.map((opt) => ({
                value: String(opt),
                label: String(opt),
              }))}
            />
          </Box>
        )}

        <Box align="center" gap="1" className="ui-pagination__controls">
          <Button
            variant="ghost"
            size="sm"
            icon="chevrons-left"
            onClick={goFirst}
            disabled={isFirstPage}
            aria-label="First page"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="chevron-left"
            onClick={goPrev}
            disabled={isFirstPage}
            aria-label="Previous page"
          />
          <Text
            as="span"
            size="sm"
            color="secondary"
            tabularNums
            className="ui-pagination__page-indicator"
          >
            Page {page} of {totalPages}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            icon="chevron-right"
            onClick={goNext}
            disabled={isLastPage}
            aria-label="Next page"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="chevrons-right"

            onClick={goLast}
            disabled={isLastPage}
            aria-label="Last page"
          />
        </Box>
      </Box>
    );
  },
);

Pagination.displayName = "Pagination";
