import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import "./ExportConfigurationLayout.css";

export interface ExportConfigurationLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  format: ReactNode;
  columns?: ReactNode;
  scope: ReactNode;
  options?: ReactNode;
  footer: ReactNode;
}

export const ExportConfigurationLayout = forwardRef<
  HTMLDivElement,
  ExportConfigurationLayoutProps
>(function ExportConfigurationLayout(
  { format, columns, scope, options, footer, className, ...rest },
  ref,
) {
  const classes = ["ui-export-config", className].filter(Boolean).join(" ");
  return (
    <div
      ref={ref}
      className={classes}
      role="region"
      aria-label="Export configuration"
      {...rest}
    >
      <section
        className="ui-export-config__section"
        aria-label="Export format"
      >
        {format}
      </section>
      {columns && (
        <section
          className="ui-export-config__section"
          aria-label="Column selection"
        >
          {columns}
        </section>
      )}
      <section className="ui-export-config__section" aria-label="Export scope">
        {scope}
      </section>
      {options && (
        <section
          className="ui-export-config__section"
          aria-label="Export options"
        >
          {options}
        </section>
      )}
      <Box justify="end" gap="content" className="ui-export-config__footer">{footer}</Box>
    </div>
  );
});
