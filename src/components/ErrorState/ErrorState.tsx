import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
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
        <Text as="h3" size="lg" weight="semibold" color="primary" className="ui-error-state__title">
          {title}
        </Text>
        {description && (
          <Text as="p" size="sm" color="secondary" className="ui-error-state__description">
            {description}
          </Text>
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
            <Button
              variant="ghost"
              size="sm"
              className="ui-error-state__details-toggle"
              onClick={() => setDetailsOpen((prev) => !prev)}
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? "Hide details" : "Show details"}
            </Button>
            {detailsOpen && (
              <pre className="ui-error-state__details-content">{details}</pre>
            )}
          </div>
        )}
      </div>
    );
  },
);
