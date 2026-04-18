import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
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
    <Box
      as="section"
      ref={ref as Ref<HTMLElement>}
      direction="column"
      gap="content"
      className={classes}
      role="region"
      aria-label={label}
      {...rest}
    >
      {toolbar && (
        <Box align="center" gap="inline" className="ui-api-keys__toolbar">
          {toolbar}
        </Box>
      )}
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
      {footer && (
        <Box
          align="center"
          justify="between"
          className="ui-api-keys__footer"
        >
          {footer}
        </Box>
      )}
    </Box>
  );
});
