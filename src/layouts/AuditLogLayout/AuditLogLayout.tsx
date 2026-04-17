import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import "./AuditLogLayout.css";

export interface AuditLogLayoutProps extends HTMLAttributes<HTMLDivElement> {
  filters?: ReactNode;
  log: ReactNode;
  detail?: ReactNode;
  label?: string;
}

export const AuditLogLayout = forwardRef<HTMLDivElement, AuditLogLayoutProps>(
  function AuditLogLayout(
    { filters, log, detail, label = "Audit log", className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-audit-log",
      detail && "ui-audit-log--with-detail",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        as="section"
        ref={ref as Ref<HTMLElement>}
        display="flex"
        direction="column"
        gap="content"
        padding="page"
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {filters && (
          <Box
            display="flex"
            wrap
            gap="inline"
            className="ui-audit-log__filters"
            role="group"
            aria-label="Audit filters"
          >
            {filters}
          </Box>
        )}
        <div className="ui-audit-log__main">
          <div
            className="ui-audit-log__log"
            role="log"
            aria-label="Audit entries"
          >
            {log}
          </div>
          {detail && (
            <div
              className="ui-audit-log__detail"
              role="group"
              aria-label="Audit entry detail"
            >
              {detail}
            </div>
          )}
        </div>
      </Box>
    );
  },
);
