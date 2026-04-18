import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./ChartTooltip.css";

export interface ChartTooltipRow {
  id: string;
  label: string;
  value: string;
  color: string;
  emphasized?: boolean;
}

export interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> {
  header?: string;
  rows: ChartTooltipRow[];
  footer?: ReactNode;
}

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  function ChartTooltip({ header, rows, footer, className, ...rest }, ref) {
    const classes = ["ui-chart-tooltip", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        role="tooltip"
        aria-live="polite"
        direction="column"
        gap="1"
        className={classes}
        {...rest}
      >
        {header && (
          <Text as="span" size="xs" weight="semibold" color="primary">
            {header}
          </Text>
        )}
        {rows.length > 0 && (
          <Box direction="column" gap="1" className="ui-chart-tooltip__rows">
            {rows.map((row) => (
              <Box
                key={row.id}
                direction="row"
                align="center"
                gap="2"
                className="ui-chart-tooltip__row"
              >
                <Box
                  aria-hidden="true"
                  className="ui-chart-tooltip__swatch"
                  style={{ background: row.color }}
                />
                <Text
                  as="span"
                  size="xs"
                  color="secondary"
                  weight={row.emphasized ? "semibold" : "normal"}
                  className="ui-chart-tooltip__label"
                >
                  {row.label}
                </Text>
                <Text
                  as="span"
                  size="xs"
                  color="primary"
                  weight={row.emphasized ? "semibold" : "medium"}
                  className="ui-chart-tooltip__value"
                >
                  {row.value}
                </Text>
              </Box>
            ))}
          </Box>
        )}
        {footer && <Box className="ui-chart-tooltip__footer">{footer}</Box>}
      </Box>
    );
  },
);

ChartTooltip.displayName = "ChartTooltip";
