import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Badge } from "../../primitives/Badge";
import { Text } from "../../primitives/Text";
import "./EnvironmentTag.css";

export type Environment =
  | "production"
  | "staging"
  | "development"
  | "preview"
  | "local";

export interface EnvironmentTagProps extends HTMLAttributes<HTMLSpanElement> {
  environment: Environment;
  label?: string;
  size?: "sm" | "md";
}

const DEFAULT_LABEL: Record<Environment, string> = {
  production: "PRODUCTION",
  staging: "STAGING",
  development: "DEVELOPMENT",
  preview: "PREVIEW",
  local: "LOCAL",
};

const VARIANT: Record<Environment, "error" | "warning" | "info" | "neutral"> = {
  production: "error",
  staging: "warning",
  development: "info",
  preview: "info",
  local: "neutral",
};

export const EnvironmentTag = forwardRef<HTMLSpanElement, EnvironmentTagProps>(
  function EnvironmentTag(
    { environment, label, size = "md", className, ...rest },
    ref,
  ) {
    const text = label ?? DEFAULT_LABEL[environment];
    const classes = [
      "ui-environment-tag",
      `ui-environment-tag--${environment}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        aria-label={`Environment: ${text}`}
        {...rest}
      >
        <Box display="inline-flex" align="center" gap="1">
          <Badge variant={VARIANT[environment]} size={size}>
            <Text as="span" size="caption" weight="bold">
              {text}
            </Text>
          </Badge>
        </Box>
      </span>
    );
  },
);
