import { forwardRef, type HTMLAttributes, type ReactNode, type Ref, type CSSProperties } from "react";
import { Box } from "../../primitives/Box";
import "./ComparisonLayout.css";

export interface ComparisonEntity {
  id: string;
  title: ReactNode;
  content?: ReactNode;
}

export interface ComparisonField<T extends ComparisonEntity = ComparisonEntity> {
  key: string;
  label: ReactNode;
  render?: (entity: T) => ReactNode;
}

export interface ComparisonLayoutProps<T extends ComparisonEntity = ComparisonEntity>
  extends HTMLAttributes<HTMLDivElement> {
  entities: T[];
  fields: ComparisonField<T>[];
  toolbar?: ReactNode;
  label?: string;
}

export const ComparisonLayout = forwardRef<HTMLDivElement, ComparisonLayoutProps>(
  function ComparisonLayout(
    {
      entities,
      fields,
      toolbar,
      label = "Comparison",
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-comparison-layout", className]
      .filter(Boolean)
      .join(" ");
    const styles = {
      ...style,
      "--ui-comparison-columns": entities.length,
    } as CSSProperties;

    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        direction="column"
        className={classes}
        role="region"
        aria-label={label}
        style={styles}
        {...rest}
      >
        {toolbar && (
          <Box
            align="center"
            gap="content"
            className="ui-comparison-layout__toolbar"
          >
            {toolbar}
          </Box>
        )}
        <Box direction="column" className="ui-comparison-layout__table" role="table">
          <div className="ui-comparison-layout__row ui-comparison-layout__row--header" role="row">
            <div
              className="ui-comparison-layout__cell ui-comparison-layout__cell--label"
              role="columnheader"
              aria-hidden="true"
            />
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="ui-comparison-layout__cell ui-comparison-layout__cell--header"
                role="columnheader"
              >
                <div className="ui-comparison-layout__entity-title">
                  {entity.title}
                </div>
                {entity.content && (
                  <div className="ui-comparison-layout__entity-content">
                    {entity.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          {fields.map((field) => (
            <div key={field.key} className="ui-comparison-layout__row" role="row">
              <div
                className="ui-comparison-layout__cell ui-comparison-layout__cell--label"
                role="rowheader"
              >
                {field.label}
              </div>
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="ui-comparison-layout__cell"
                  role="cell"
                >
                  {field.render ? field.render(entity) : null}
                </div>
              ))}
            </div>
          ))}
        </Box>
      </Box>
    );
  },
) as <T extends ComparisonEntity = ComparisonEntity>(
  props: ComparisonLayoutProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReactNode;
