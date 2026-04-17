import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./BulkEditLayout.css";

export interface BulkEditLayoutProps extends HTMLAttributes<HTMLElement> {
  selectionSummary: ReactNode;
  fields: ReactNode;
  footer?: ReactNode;
}

export const BulkEditLayout = forwardRef<HTMLElement, BulkEditLayoutProps>(
  function BulkEditLayout(
    { selectionSummary, fields, footer, className, ...rest },
    ref,
  ) {
    const classes = ["ui-bulk-edit", className].filter(Boolean).join(" ");
    return (
      <aside
        ref={ref}
        className={classes}
        aria-label="Bulk edit"
        {...rest}
      >
        <header className="ui-bulk-edit__summary">
          <div role="status" className="ui-bulk-edit__summary-text">
            {selectionSummary}
          </div>
        </header>
        <section
          className="ui-bulk-edit__fields"
          aria-label="Bulk edit fields"
        >
          {fields}
        </section>
        {footer && <footer className="ui-bulk-edit__footer">{footer}</footer>}
      </aside>
    );
  },
);
