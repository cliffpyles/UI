import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./APIKeyManagementLayout.css";

export interface APIKeyManagementLayoutProps extends HTMLAttributes<HTMLDivElement> {
  toolbar?: ReactNode;
  keys: ReactNode;
  createForm?: ReactNode;
  footer?: ReactNode;
  showCreate?: boolean;
  label?: string;
}

export const APIKeyManagementLayout = forwardRef<
  HTMLDivElement,
  APIKeyManagementLayoutProps
>(function APIKeyManagementLayout(
  {
    toolbar,
    keys,
    createForm,
    footer,
    showCreate = false,
    label = "API key management",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-api-keys", className].filter(Boolean).join(" ");

  return (
    <section
      ref={ref}
      className={classes}
      role="region"
      aria-label={label}
      {...rest}
    >
      {toolbar && <div className="ui-api-keys__toolbar">{toolbar}</div>}
      {showCreate && createForm && (
        <div
          className="ui-api-keys__create"
          role="group"
          aria-label="Create API key"
        >
          {createForm}
        </div>
      )}
      <div className="ui-api-keys__table">{keys}</div>
      {footer && <div className="ui-api-keys__footer">{footer}</div>}
    </section>
  );
});
