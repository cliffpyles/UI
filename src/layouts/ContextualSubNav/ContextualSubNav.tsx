import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
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
      <nav ref={ref} aria-label={ariaLabel} className={classes} {...rest}>
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
                  <button
                    type="button"
                    className={itemClass}
                    aria-current={item.active ? "page" : undefined}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {actions && <div className="ui-sub-nav__actions">{actions}</div>}
      </nav>
    );
  },
);
