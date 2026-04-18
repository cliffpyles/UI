import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
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
        <Text as="h3" size="base" weight="semibold" className="ui-data-source-setup__heading">
          Credentials
        </Text>
        <Box direction="column" gap="2" className="ui-data-source-setup__body">{credentials}</Box>
      </section>
      {testConnection && (
        <section
          className="ui-data-source-setup__section"
          aria-label="Test connection"
        >
          <Text as="h3" size="base" weight="semibold" className="ui-data-source-setup__heading">
            Test connection
          </Text>
          <Box direction="column" gap="2" className="ui-data-source-setup__body">{testConnection}</Box>
        </section>
      )}
      {schemaPreview && (
        <section
          className="ui-data-source-setup__section"
          aria-label="Schema preview"
        >
          <Text as="h3" size="base" weight="semibold" className="ui-data-source-setup__heading">
            Schema preview
          </Text>
          <Box direction="column" gap="2" className="ui-data-source-setup__body">{schemaPreview}</Box>
        </section>
      )}
      {syncSettings && (
        <section
          className="ui-data-source-setup__section"
          aria-label="Sync settings"
        >
          <Text as="h3" size="base" weight="semibold" className="ui-data-source-setup__heading">
            Sync settings
          </Text>
          <div className="ui-data-source-setup__body">{syncSettings}</div>
        </section>
      )}
      {footer && (
        <Box align="center" justify="end" gap="2" className="ui-data-source-setup__footer">{footer}</Box>
      )}
    </div>
  );
});
