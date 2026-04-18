import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Button } from "../../components/Button";
import "./ContextualSubNav.css";

export interface SubNavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface ContextualSubNavProps extends HTMLAttributes<HTMLElement> {
  items: SubNavItem[];
  ariaLabel?: string;
  actions?: ReactNode;
  variant?: "tabs" | "links";
}

export const ContextualSubNav = forwardRef<HTMLElement, ContextualSubNavProps>(
  function ContextualSubNav(
    {
      items,
      ariaLabel = "Section",
      actions,
      variant = "tabs",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = [
      "ui-sub-nav",
      `ui-sub-nav--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        as="nav"
        ref={ref as Ref<HTMLElement>}
        aria-label={ariaLabel}
        className={classes}
        display="flex"
        align="center"
        justify="between"
        gap="4"
        {...rest}
      >
        <ul className="ui-sub-nav__list" role="list">
          {items.map((item) => {
            const itemClass = [
              "ui-sub-nav__item",
              item.active && "ui-sub-nav__item--active",
              item.disabled && "ui-sub-nav__item--disabled",
            ]
              .filter(Boolean)
              .join(" ");

            const content = (
              <>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ui-sub-nav__badge">{item.badge}</span>
                )}
              </>
            );

            return (
              <li key={item.id} className="ui-sub-nav__li">
                {item.href ? (
                  <a
                    href={item.href}
                    className={itemClass}
                    aria-current={item.active ? "page" : undefined}
                    aria-disabled={item.disabled}
                    onClick={item.disabled ? (e) => e.preventDefault() : item.onClick}
                  >
                    {content}
                  </a>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={itemClass}
                    aria-current={item.active ? "page" : undefined}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {content}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
        {actions && (
          <Box
            className="ui-sub-nav__actions"
            display="flex"
            align="center"
            gap="2"
            shrink={false}
          >
            {actions}
          </Box>
        )}
      </Box>
    );
  },
);
