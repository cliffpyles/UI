import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./DataSourceSetupLayout.css";

export interface DataSourceSetupLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  credentials: ReactNode;
  testConnection?: ReactNode;
  schemaPreview?: ReactNode;
  syncSettings?: ReactNode;
  footer?: ReactNode;
}

export const DataSourceSetupLayout = forwardRef<
  HTMLDivElement,
  DataSourceSetupLayoutProps
>(function DataSourceSetupLayout(
  {
    credentials,
    testConnection,
    schemaPreview,
    syncSettings,
    footer,
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-data-source-setup", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} {...rest}>
      <section
        className="ui-data-source-setup__section"
        aria-label="Credentials"
      >
        <h3 className="ui-data-source-setup__heading">Credentials</h3>
        <div className="ui-data-source-setup__body">{credentials}</div>
      </section>
      {testConnection && (
        <section
          className="ui-data-source-setup__section"
          aria-label="Test connection"
        >
          <h3 className="ui-data-source-setup__heading">Test connection</h3>
          <div className="ui-data-source-setup__body">{testConnection}</div>
        </section>
      )}
      {schemaPreview && (
        <section
          className="ui-data-source-setup__section"
          aria-label="Schema preview"
        >
          <h3 className="ui-data-source-setup__heading">Schema preview</h3>
          <div className="ui-data-source-setup__body">{schemaPreview}</div>
        </section>
      )}
      {syncSettings && (
        <section
          className="ui-data-source-setup__section"
          aria-label="Sync settings"
        >
          <h3 className="ui-data-source-setup__heading">Sync settings</h3>
          <div className="ui-data-source-setup__body">{syncSettings}</div>
        </section>
      )}
      {footer && (
        <div className="ui-data-source-setup__footer">{footer}</div>
      )}
    </div>
  );
});
