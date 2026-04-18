import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../../components/Button";
import "./Breadcrumbs.css";

export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: ReactNode;
  ariaLabel?: string;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(
    {
      items,
      maxItems = 0,
      separator = "/",
      ariaLabel = "Breadcrumb",
      className,
      ...rest
    },
    ref,
  ) {
    const shouldCollapse = maxItems > 0 && items.length > maxItems;
    const displayed: Array<BreadcrumbItem | { ellipsis: true }> = shouldCollapse
      ? [items[0]!, { ellipsis: true }, ...items.slice(items.length - (maxItems - 2))]
      : items;

    const classes = ["ui-breadcrumbs", className].filter(Boolean).join(" ");

    return (
      <nav ref={ref} aria-label={ariaLabel} className={classes} {...rest}>
        <ol className="ui-breadcrumbs__list">
          {displayed.map((entry, idx) => {
            const isLast = idx === displayed.length - 1;
            const key = "ellipsis" in entry ? `ellipsis-${idx}` : (entry.id ?? `${entry.label}-${idx}`);
            return (
              <Fragment key={key}>
                <li className="ui-breadcrumbs__item">
                  {"ellipsis" in entry ? (
                    <span className="ui-breadcrumbs__ellipsis" aria-hidden="true">
                      …
                    </span>
                  ) : isLast ? (
                    <span
                      className="ui-breadcrumbs__current"
                      aria-current="page"
                    >
                      {entry.label}
                    </span>
                  ) : entry.href ? (
                    <a
                      href={entry.href}
                      className="ui-breadcrumbs__link"
                      onClick={entry.onClick}
                    >
                      {entry.label}
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ui-breadcrumbs__link"
                      onClick={entry.onClick}
                    >
                      {entry.label}
                    </Button>
                  )}
                </li>
                {!isLast && (
                  <li
                    className="ui-breadcrumbs__separator"
                    aria-hidden="true"
                  >
                    {separator}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
);
