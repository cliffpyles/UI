import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../../components/Button";
import "./ReportViewerLayout.css";

export interface ReportViewerLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  header: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const ReportViewerLayout = forwardRef<HTMLDivElement, ReportViewerLayoutProps>(
  function ReportViewerLayout(
    {
      header,
      content,
      footer,
      currentPage,
      totalPages,
      onPageChange,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-report-viewer", className].filter(Boolean).join(" ");
    const hasPager =
      typeof currentPage === "number" && typeof totalPages === "number";
    const canPrev = hasPager && currentPage! > 1;
    const canNext = hasPager && currentPage! < totalPages!;

    return (
      <div ref={ref} className={classes} {...rest}>
        <header className="ui-report-viewer__header">{header}</header>
        {hasPager && (
          <nav
            className="ui-report-viewer__pager"
            aria-label="Report pagination"
          >
            <Button
              variant="ghost"
              size="sm"
              className="ui-report-viewer__page-btn"
              onClick={() => onPageChange?.(currentPage! - 1)}
              disabled={!canPrev}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span className="ui-report-viewer__page-status" aria-live="polite">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ui-report-viewer__page-btn"
              onClick={() => onPageChange?.(currentPage! + 1)}
              disabled={!canNext}
              aria-label="Next page"
            >
              Next
            </Button>
          </nav>
        )}
        <section
          className="ui-report-viewer__content"
          aria-label="Report content"
        >
          {content}
        </section>
        {footer && (
          <footer className="ui-report-viewer__footer">{footer}</footer>
        )}
      </div>
    );
  },
);
