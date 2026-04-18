import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Icon, type IconName } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
import { Tooltip } from "../../components/Tooltip";
import { Button } from "../../components/Button";
import "./CollapsibleSidebarNav.css";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon?: IconName;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: ReactNode;
  pinned?: boolean;
  children?: SidebarNavItem[];
}

export interface CollapsibleSidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode;
  ariaLabel?: string;
}

export const CollapsibleSidebarNav = forwardRef<HTMLElement, CollapsibleSidebarNavProps>(
  function CollapsibleSidebarNav(
    {
      items,
      collapsed = false,
      onCollapsedChange,
      header,
      footer,
      ariaLabel = "Primary",
      className,
      ...rest
    },
    ref,
  ) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggle = (id: string) =>
      setExpanded((s) => ({ ...s, [id]: !s[id] }));

    const classes = [
      "ui-sidebar-nav",
      collapsed && "ui-sidebar-nav--collapsed",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const renderItem = (item: SidebarNavItem, depth = 0): ReactNode => {
      const hasChildren = !!item.children && item.children.length > 0;
      const isOpen = expanded[item.id] ?? false;

      const inner = (
        <span className="ui-sidebar-nav__item-inner">
          {item.icon && (
            <Icon name={item.icon} size="sm" className="ui-sidebar-nav__icon" />
          )}
          {!collapsed && (
            <Text as="span" size="label" className="ui-sidebar-nav__label">
              {item.label}
            </Text>
          )}
          {!collapsed && item.badge && (
            <span className="ui-sidebar-nav__badge">{item.badge}</span>
          )}
          {!collapsed && hasChildren && (
            <Icon
              name={isOpen ? "chevron-down" : "chevron-right"}
              size="xs"
              className="ui-sidebar-nav__chevron"
            />
          )}
        </span>
      );

      const button = item.href ? (
        <a
          href={item.href}
          className={[
            "ui-sidebar-nav__item",
            item.active && "ui-sidebar-nav__item--active",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={item.onClick}
          style={{ paddingLeft: `calc(var(--spacing-3) + ${depth * 16}px)` }}
          aria-current={item.active ? "page" : undefined}
        >
          {inner}
        </a>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className={[
            "ui-sidebar-nav__item",
            item.active && "ui-sidebar-nav__item--active",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={item.active ? "page" : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          onClick={() => {
            if (hasChildren) toggle(item.id);
            item.onClick?.();
          }}
          style={{ paddingLeft: `calc(var(--spacing-3) + ${depth * 16}px)` }}
        >
          {inner}
        </Button>
      );

      const wrapped = collapsed ? (
        <Tooltip content={item.label} side="right">
          {button}
        </Tooltip>
      ) : (
        button
      );

      return (
        <li key={item.id} className="ui-sidebar-nav__li">
          {wrapped}
          {hasChildren && !collapsed && isOpen && (
            <ul className="ui-sidebar-nav__children" role="group">
              {item.children!.map((c) => renderItem(c, depth + 1))}
            </ul>
          )}
        </li>
      );
    };

    const pinned = items.filter((i) => i.pinned);
    const regular = items.filter((i) => !i.pinned);

    return (
      <nav ref={ref} aria-label={ariaLabel} className={classes} {...rest}>
        {header && <div className="ui-sidebar-nav__header">{header}</div>}
        <div className="ui-sidebar-nav__scroll">
          {pinned.length > 0 && (
            <ul className="ui-sidebar-nav__list ui-sidebar-nav__list--pinned">
              {pinned.map((i) => renderItem(i))}
            </ul>
          )}
          <ul className="ui-sidebar-nav__list">
            {regular.map((i) => renderItem(i))}
          </ul>
        </div>
        <Box direction="column" gap="2" className="ui-sidebar-nav__footer">
          {footer}
          <Button
            variant="ghost"
            size="sm"
            className="ui-sidebar-nav__toggle"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => onCollapsedChange?.(!collapsed)}
          >
            <Icon
              name={collapsed ? "chevron-right" : "chevron-left"}
              size="sm"
            />
          </Button>
        </Box>
      </nav>
    );
  },
);
