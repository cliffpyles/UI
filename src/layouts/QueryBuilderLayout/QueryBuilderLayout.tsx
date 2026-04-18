import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import "./QueryBuilderLayout.css";

export interface QueryBuilderLayoutProps extends HTMLAttributes<HTMLDivElement> {
  expression: ReactNode;
  preview?: ReactNode;
  actions?: ReactNode;
  expressionLabel?: string;
  previewLabel?: string;
}

export const QueryBuilderLayout = forwardRef<HTMLDivElement, QueryBuilderLayoutProps>(
  function QueryBuilderLayout(
    {
      expression,
      preview,
      actions,
      expressionLabel = "Query expression",
      previewLabel = "Query preview",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-query-builder", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        display="flex"
        direction="column"
        className={classes}
        {...rest}
      >
        <section
          className="ui-query-builder__expression"
          aria-label={expressionLabel}
        >
          {expression}
        </section>
        {preview && (
          <section
            className="ui-query-builder__preview"
            aria-label={previewLabel}
          >
            {preview}
          </section>
        )}
        {actions && (
          <Box
            display="flex"
            justify="end"
            gap="content"
            className="ui-query-builder__actions"
          >
            {actions}
          </Box>
        )}
      </Box>
    );
  },
);
