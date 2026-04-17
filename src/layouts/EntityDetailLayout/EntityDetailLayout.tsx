/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../Breadcrumbs";
import "./EntityDetailLayout.css";

export interface EntityDetailLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}

const EntityDetailRoot = forwardRef<HTMLDivElement, EntityDetailLayoutProps>(
  function EntityDetailLayout(
    { title, subtitle, breadcrumbs, actions, meta, children, className, ...rest },
    ref,
  ) {
    const classes = ["ui-entity-detail", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...rest}>
        <header className="ui-entity-detail__header">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="ui-entity-detail__crumbs" />
          )}
          <div className="ui-entity-detail__titlebar">
            <div className="ui-entity-detail__titles">
              <h1 className="ui-entity-detail__title">{title}</h1>
              {subtitle && (
                <div className="ui-entity-detail__subtitle">{subtitle}</div>
              )}
            </div>
            {actions && (
              <div className="ui-entity-detail__actions">{actions}</div>
            )}
          </div>
          {meta && <div className="ui-entity-detail__meta">{meta}</div>}
        </header>
        <div className="ui-entity-detail__body">{children}</div>
      </div>
    );
  },
);

const EntityDetailSection = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { heading?: ReactNode }>(
  function EntityDetailSection({ heading, className, children, ...rest }, ref) {
    return (
      <section
        ref={ref}
        className={["ui-entity-detail__section", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {heading && (
          <h2 className="ui-entity-detail__section-heading">{heading}</h2>
        )}
        {children}
      </section>
    );
  },
);

export const EntityDetailLayout = Object.assign(EntityDetailRoot, {
  Section: EntityDetailSection,
});
