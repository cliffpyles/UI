import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import { Button } from "../Button";
import "./ErrorState.css";

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Error title. */
  title?: string;
  /** Error description. */
  description?: ReactNode;
  /** Retry handler. When provided, a retry button is shown. */
  onRetry?: () => void;
  /** Whether a retry is in progress. */
  retrying?: boolean;
  /** Technical error details. Shown in a collapsible section. */
  details?: string;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  function ErrorState(
    {
      title = "Something went wrong",
      description,
      onRetry,
      retrying = false,
      details,
      className,
      ...props
    },
    ref,
  ) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const classes = ["ui-error-state", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} role="alert" className={classes} {...props}>
        <div className="ui-error-state__icon">
          <Icon name="alert-circle" size="xl" color="error" />
        </div>
        <h3 className="ui-error-state__title">{title}</h3>
        {description && (
          <p className="ui-error-state__description">{description}</p>
        )}
        {onRetry && (
          <div className="ui-error-state__action">
            <Button
              variant="secondary"
              size="sm"
              loading={retrying}
              onClick={onRetry}
            >
              Retry
            </Button>
          </div>
        )}
        {details && (
          <div className="ui-error-state__details">
            <button
              type="button"
              className="ui-error-state__details-toggle"
              onClick={() => setDetailsOpen((prev) => !prev)}
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? "Hide details" : "Show details"}
            </button>
            {detailsOpen && (
              <pre className="ui-error-state__details-content">{details}</pre>
            )}
          </div>
        )}
      </div>
    );
  },
);
