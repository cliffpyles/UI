/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../Breadcrumbs";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
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
      <Box ref={ref as Ref<HTMLElement>} className={classes} display="flex" direction="column" {...rest}>
        <Box
          as="header"
          className="ui-entity-detail__header"
          display="flex"
          direction="column"
          gap="3"
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="ui-entity-detail__crumbs" />
          )}
          <Box
            className="ui-entity-detail__titlebar"
            display="flex"
            align="start"
            justify="between"
            gap="3"
          >
            <Box
              className="ui-entity-detail__titles"
              display="flex"
              direction="column"
              gap="1"
              minWidth={0}
            >
              <Text as="h1" size="xl" weight="semibold" className="ui-entity-detail__title">
                {title}
              </Text>
              {subtitle && (
                <div className="ui-entity-detail__subtitle">{subtitle}</div>
              )}
            </Box>
            {actions && (
              <Box
                className="ui-entity-detail__actions"
                display="flex"
                align="center"
                gap="2"
                shrink={false}
              >
                {actions}
              </Box>
            )}
          </Box>
          {meta && (
            <Box
              className="ui-entity-detail__meta"
              display="flex"
              wrap
              gap="3"
            >
              {meta}
            </Box>
          )}
        </Box>
        <Box
          className="ui-entity-detail__body"
          display="flex"
          direction="column"
          gap="6"
          grow
        >
          {children}
        </Box>
      </Box>
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
          <Text as="h2" size="lg" weight="semibold" className="ui-entity-detail__section-heading">
            {heading}
          </Text>
        )}
        {children}
      </section>
    );
  },
);

export const EntityDetailLayout = Object.assign(EntityDetailRoot, {
  Section: EntityDetailSection,
});
