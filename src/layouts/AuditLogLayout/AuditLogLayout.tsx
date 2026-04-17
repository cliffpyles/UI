import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
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
      <section
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {filters && (
          <div
            className="ui-audit-log__filters"
            role="group"
            aria-label="Audit filters"
          >
            {filters}
          </div>
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
      </section>
    );
  },
);
