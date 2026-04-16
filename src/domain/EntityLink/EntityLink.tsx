import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Icon, type IconName } from "../../primitives/Icon";
import "./EntityLink.css";

export interface EntityData {
  type: string;
  id: string | number;
  label: string;
  icon?: IconName;
}

export interface EntityLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  entity: EntityData;
  showType?: boolean;
  external?: boolean;
}

const TYPE_ICON: Record<string, IconName> = {
  user: "user",
  file: "download",
  project: "filter",
  task: "edit",
};

export const EntityLink = forwardRef<HTMLAnchorElement, EntityLinkProps>(
  function EntityLink(
    { entity, showType, external, className, children, href, ...rest },
    ref,
  ) {
    const classes = ["ui-entity-link", className].filter(Boolean).join(" ");
    const iconName = entity.icon ?? TYPE_ICON[entity.type];

    return (
      <a
        ref={ref}
        className={classes}
        href={href ?? "#"}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {iconName && (
          <Icon name={iconName} size="xs" className="ui-entity-link__icon" aria-hidden />
        )}
        <span className="ui-entity-link__label">{children ?? entity.label}</span>
        {showType && <span className="ui-entity-link__type">{entity.type}</span>}
        {external && (
          <Icon name="external-link" size="xs" className="ui-entity-link__external" aria-hidden />
        )}
      </a>
    );
  },
);
