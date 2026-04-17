import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./UserManagementLayout.css";

export interface UserManagementLayoutProps extends HTMLAttributes<HTMLDivElement> {
  toolbar?: ReactNode;
  table: ReactNode;
  footer?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
  label?: string;
}

export const UserManagementLayout = forwardRef<HTMLDivElement, UserManagementLayoutProps>(
  function UserManagementLayout(
    { toolbar, table, footer, selectedCount = 0, bulkActions, label = "User management", className, ...rest },
    ref,
  ) {
    const classes = ["ui-user-management", className].filter(Boolean).join(" ");
    const showBulk = selectedCount > 0 && bulkActions;

    return (
      <section
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {toolbar && <div className="ui-user-management__toolbar">{toolbar}</div>}
        {showBulk && (
          <div
            className="ui-user-management__bulk"
            role="status"
            aria-live="polite"
          >
            <span className="ui-user-management__bulk-count">
              {selectedCount} selected
            </span>
            <div className="ui-user-management__bulk-actions">{bulkActions}</div>
          </div>
        )}
        <div className="ui-user-management__table">{table}</div>
        {footer && <div className="ui-user-management__footer">{footer}</div>}
      </section>
    );
  },
);
