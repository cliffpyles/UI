import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon } from "../../primitives/Icon";
import { Button } from "../../components/Button";
import "./ChartLegend.css";

export interface ChartLegendItem {
  id: string;
  label: string;
  color: string;
  visible?: boolean;
  disabled?: boolean;
}

export interface ChartLegendProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  items: ChartLegendItem[];
  orientation?: "horizontal" | "vertical";
  onToggle?: (id: string, visible: boolean) => void;
  align?: "start" | "center" | "end";
}

export const ChartLegend = forwardRef<HTMLDivElement, ChartLegendProps>(
  function ChartLegend(
    {
      items,
      orientation = "horizontal",
      onToggle,
      align = "start",
      className,
      ...rest
    },
    ref,
  ) {
    if (items.length === 0) return null;

    const classes = [
      "ui-chart-legend",
      `ui-chart-legend--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        role="list"
        direction={orientation === "vertical" ? "column" : "row"}
        wrap={orientation === "horizontal"}
        align="center"
        justify={align}
        gap="3"
        className={classes}
        {...rest}
      >
        {items.map((item) => {
          const visible = item.visible !== false;
          const itemClasses = [
            "ui-chart-legend__item",
            !visible && "ui-chart-legend__item--hidden",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <Box
              key={item.id}
              role="listitem"
              direction="row"
              align="center"
              className={itemClasses}
            >
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={visible}
                aria-disabled={item.disabled || undefined}
                aria-label={`Toggle series ${item.label}`}
                disabled={item.disabled}
                onClick={
                  onToggle && !item.disabled
                    ? () => onToggle(item.id, !visible)
                    : undefined
                }
              >
                <Box direction="row" align="center" gap="1">
                  <span
                    className="ui-chart-legend__swatch"
                    style={{ color: item.color }}
                    aria-hidden="true"
                  >
                    <Icon name="square-filled" size="xs" />
                  </span>
                  <Text as="span" size="sm">
                    {item.label}
                  </Text>
                </Box>
              </Button>
            </Box>
          );
        })}
      </Box>
    );
  },
);

ChartLegend.displayName = "ChartLegend";
