import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon, type IconName } from "../../primitives/Icon";
import "./EntityLink.css";

export type EntityType =
  | "issue"
  | "project"
  | "user"
  | "team"
  | "document"
  | "commit"
  | "release"
  | "custom";

export interface EntityLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  type: EntityType;
  identifier?: string;
  label: string;
  href: string;
  iconOverride?: ReactNode;
  truncate?: boolean;
  disabled?: boolean;
}

const TYPE_ICON: Record<Exclude<EntityType, "custom">, IconName> = {
  issue: "alert-circle",
  project: "filter",
  user: "user",
  team: "users",
  document: "edit",
  commit: "settings",
  release: "download",
};

export const EntityLink = forwardRef<HTMLAnchorElement, EntityLinkProps>(
  function EntityLink(
    {
      type,
      identifier,
      label,
      href,
      iconOverride,
      truncate = true,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const classes = [
      "ui-entity-link",
      `ui-entity-link--${type}`,
      disabled && "ui-entity-link--disabled",
      truncate && "ui-entity-link--truncate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const fullText = identifier ? `${identifier} ${label}` : label;
    const icon =
      type === "custom"
        ? iconOverride
        : <Icon
            name={TYPE_ICON[type]}
            size="sm"
            aria-hidden
            className="ui-entity-link__icon"
          />;

    return (
      <a
        ref={ref}
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        title={fullText}
        aria-label={fullText}
        {...rest}
      >
        <Box display="inline-flex" align="center" gap="0.5">
          {icon}
          {identifier && (
            <Text as="span" weight="medium" color="inherit">
              {identifier}
            </Text>
          )}
          <Text
            as="span"
            color="inherit"
            truncate={truncate}
            className="ui-entity-link__label"
          >
            {children ?? label}
          </Text>
        </Box>
      </a>
    );
  },
);
