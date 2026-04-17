import {
  forwardRef,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import "./FullPageFormLayout.css";

export interface FullPageFormLayoutProps
  extends FormHTMLAttributes<HTMLFormElement> {
  header?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  sidebar?: ReactNode;
  isDirty?: boolean;
  columns?: 1 | 2;
}

export const FullPageFormLayout = forwardRef<
  HTMLFormElement,
  FullPageFormLayoutProps
>(function FullPageFormLayout(
  {
    header,
    children,
    footer,
    sidebar,
    isDirty = false,
    columns = 1,
    className,
    ...rest
  },
  ref,
) {
  const classes = [
    "ui-full-page-form",
    `ui-full-page-form--cols-${columns}`,
    sidebar && "ui-full-page-form--with-sidebar",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <form ref={ref} className={classes} {...rest}>
      {header && (
        <header className="ui-full-page-form__header">
          {header}
          {isDirty && (
            <span
              className="ui-full-page-form__dirty-indicator"
              aria-label="Unsaved changes"
              role="status"
            >
              Unsaved changes
            </span>
          )}
        </header>
      )}
      <div className="ui-full-page-form__body">
        <div className="ui-full-page-form__fields">{children}</div>
        {sidebar && (
          <aside
            className="ui-full-page-form__sidebar"
            aria-label="Form help"
          >
            {sidebar}
          </aside>
        )}
      </div>
      <footer className="ui-full-page-form__footer">{footer}</footer>
    </form>
  );
});
