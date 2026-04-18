import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import "./DataGridLayout.css";

export interface DataGridLayoutProps extends HTMLAttributes<HTMLDivElement> {
  toolbar?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  label?: string;
}

export const DataGridLayout = forwardRef<HTMLDivElement, DataGridLayoutProps>(
  function DataGridLayout(
    { toolbar, filters, children, label = "Data grid", className, ...rest },
    ref,
  ) {
    const classes = ["ui-data-grid-layout", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        direction="column"
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {toolbar && (
          <Box
            align="center"
            gap="content"
            className="ui-data-grid-layout__toolbar"
          >
            {toolbar}
          </Box>
        )}
        {filters && (
          <Box
            wrap
            gap="content"
            className="ui-data-grid-layout__filters"
          >
            {filters}
          </Box>
        )}
        <div className="ui-data-grid-layout__body">{children}</div>
      </Box>
    );
  },
);
