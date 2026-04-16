/* eslint-disable react-refresh/only-export-components */
import {
  forwardRef,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { Icon } from "../../primitives/Icon";
import "./Table.css";

/* ---------- Table ---------- */

export type TableProps = HTMLAttributes<HTMLTableElement>;

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  function Table({ className, ...props }, ref) {
    const classes = ["ui-table", className].filter(Boolean).join(" ");
    return <table ref={ref} className={classes} {...props} />;
  },
);

/* ---------- Table.Header ---------- */

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...props }, ref) {
    const classes = ["ui-table__header", className].filter(Boolean).join(" ");
    return <thead ref={ref} className={classes} {...props} />;
  },
);

/* ---------- Table.Body ---------- */

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...props }, ref) {
    const classes = ["ui-table__body", className].filter(Boolean).join(" ");
    return <tbody ref={ref} className={classes} {...props} />;
  },
);

/* ---------- Table.Footer ---------- */

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...props }, ref) {
    const classes = ["ui-table__footer", className].filter(Boolean).join(" ");
    return <tfoot ref={ref} className={classes} {...props} />;
  },
);

/* ---------- Table.Row ---------- */

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, ...props }, ref) {
    const classes = ["ui-table__row", className].filter(Boolean).join(" ");
    return <tr ref={ref} className={classes} {...props} />;
  },
);

/* ---------- Table.Head ---------- */

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Whether the column is sortable. */
  sortable?: boolean;
  /** Current sort direction, or false if unsorted. */
  sorted?: "asc" | "desc" | false;
  /** Callback when the sort is toggled. */
  onSort?: () => void;
  /** Whether the column contains numeric data. */
  numeric?: boolean;
  /** Whether the header is sticky. */
  sticky?: boolean;
  /** Column width. */
  width?: string | number;
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead(
    {
      sortable = false,
      sorted = false,
      onSort,
      numeric = false,
      sticky = false,
      width,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) {
    const classes = [
      "ui-table__head",
      numeric && "ui-table__head--numeric",
      sticky && "ui-table__head--sticky",
      sortable && "ui-table__head--sortable",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
      if (sortable && onSort && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onSort();
      }
      props.onKeyDown?.(e);
    };

    const cellStyle = width ? { ...style, width } : style;

    return (
      <th
        ref={ref}
        className={classes}
        scope="col"
        aria-sort={
          sorted === "asc"
            ? "ascending"
            : sorted === "desc"
              ? "descending"
              : undefined
        }
        tabIndex={sortable ? 0 : undefined}
        onClick={sortable && onSort ? onSort : undefined}
        onKeyDown={sortable ? handleKeyDown : props.onKeyDown}
        style={cellStyle}
        {...props}
      >
        <span className="ui-table__head-content">
          {children}
          {sortable && (
            <span className="ui-table__sort-icon" aria-hidden="true">
              {sorted === "asc" ? (
                <Icon name="sort-asc" size="xs" color="currentColor" />
              ) : sorted === "desc" ? (
                <Icon name="sort-desc" size="xs" color="currentColor" />
              ) : (
                <Icon name="sort-asc" size="xs" color="currentColor" />
              )}
            </span>
          )}
        </span>
      </th>
    );
  },
);

/* ---------- Table.Cell ---------- */

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Whether the cell contains numeric data. */
  numeric?: boolean;
  /** Whether the cell content should be truncated. */
  truncate?: boolean;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    { numeric = false, truncate = false, className, children, ...props },
    ref,
  ) {
    const classes = [
      "ui-table__cell",
      numeric && "ui-table__cell--numeric",
      truncate && "ui-table__cell--truncate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <td ref={ref} className={classes} {...props}>
        {truncate ? (
          <span className="ui-table__cell-truncate">{children}</span>
        ) : (
          children
        )}
      </td>
    );
  },
);

/* ---------- Compound export ---------- */

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});
