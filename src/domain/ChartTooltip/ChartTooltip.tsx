import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./ChartTooltip.css";

export interface ChartTooltipRow {
  label: ReactNode;
  value: ReactNode;
  color?: string;
}

export interface ChartTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  rows: ChartTooltipRow[];
  position?: { x: number; y: number };
}

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  function ChartTooltip({ title, rows, position, className, style, ...rest }, ref) {
    const classes = ["ui-chart-tooltip", className].filter(Boolean).join(" ");
    const mergedStyle = {
      ...style,
      ...(position
        ? { transform: `translate(${position.x}px, ${position.y}px)` }
        : {}),
    };

    return (
      <div ref={ref} className={classes} role="tooltip" style={mergedStyle} {...rest}>
        {title && (
          <Text
            as="span"
            weight="semibold"
            color="primary"
            className="ui-chart-tooltip__title"
          >
            {title}
          </Text>
        )}
        <Box
          className="ui-chart-tooltip__rows"
          display="flex"
          direction="column"
          gap="0.5"
        >
          {rows.map((r, i) => (
            <Box
              key={i}
              className="ui-chart-tooltip__row"
              display="flex"
              align="center"
              gap="2"
            >
              {r.color && (
                <span
                  className="ui-chart-tooltip__swatch"
                  style={{ background: r.color }}
                  aria-hidden="true"
                />
              )}
              <Text
                as="span"
                color="secondary"
                className="ui-chart-tooltip__label"
              >
                {r.label}
              </Text>
              <Text as="span" weight="medium" color="primary" tabularNums>
                {r.value}
              </Text>
            </Box>
          ))}
        </Box>
      </div>
    );
  },
);
