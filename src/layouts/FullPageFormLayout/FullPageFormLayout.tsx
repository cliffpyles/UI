import {
  forwardRef,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Grid } from "../../primitives/Grid";
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
        <Box
          as="header"
          display="flex"
          align="center"
          justify="between"
          gap="content"
          padding="page"
          className="ui-full-page-form__header"
        >
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
        </Box>
      )}
      <Grid
        gap="section"
        columns={sidebar ? "1fr auto" : undefined}
        className="ui-full-page-form__body"
      >
        <Grid
          gap="content"
          columns={columns === 2 ? 2 : undefined}
          className="ui-full-page-form__fields"
        >
          {children}
        </Grid>
        {sidebar && (
          <Box
            as="aside"
            className="ui-full-page-form__sidebar"
            aria-label="Form help"
          >
            {sidebar}
          </Box>
        )}
      </Grid>
      <Box
        as="footer"
        display="flex"
        align="center"
        justify="end"
        gap="content"
        padding="page"
        className="ui-full-page-form__footer"
      >
        {footer}
      </Box>
    </form>
  );
});
