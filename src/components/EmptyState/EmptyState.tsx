import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Icon } from "../../primitives/Icon";
import type { IconName } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
import type { ButtonProps } from "../Button";
import "./EmptyState.css";

// `action` is expected to be a `Button` per design/components/composite/EmptyState.md.
export type EmptyStateAction = React.ReactElement<ButtonProps>;

type EmptyStateVariant =
  | "no-data"
  | "no-results"
  | "error"
  | "first-use"
  | "restricted";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** The type of empty state to display. */
  variant?: EmptyStateVariant;
  /** Title text. */
  title: string;
  /** Optional description. */
  description?: ReactNode;
  /** Custom icon. If omitted, a default icon is derived from the variant. */
  icon?: ReactNode;
  /** Optional action element (e.g. a Button). */
  action?: ReactNode;
}

const variantIconMap: Record<EmptyStateVariant, IconName> = {
  "no-data": "plus",
  "no-results": "search",
  "error": "alert-circle",
  "first-use": "info",
  "restricted": "eye-off",
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      variant = "no-data",
      title,
      description,
      icon,
      action,
      className,
      ...props
    },
    ref,
  ) {
    const classes = ["ui-empty-state", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="column"
        align="center"
        justify="center"
        gap="3"
        className={classes}
        {...props}
      >
        <Box
          align="center"
          justify="center"
          className="ui-empty-state__icon"
        >
          {icon ?? <Icon name={variantIconMap[variant]} size="xl" color="secondary" />}
        </Box>
        <Text as="h3" size="lg" weight="semibold" color="primary" className="ui-empty-state__title">
          {title}
        </Text>
        {description && (
          <Text as="p" size="sm" color="secondary" className="ui-empty-state__description">
            {description}
          </Text>
        )}
        {action && (
          <Box className="ui-empty-state__action">{action}</Box>
        )}
      </Box>
    );
  },
);

EmptyState.displayName = "EmptyState";
