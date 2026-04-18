import { forwardRef, useState, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { EmptyChart } from "../EmptyChart";
import { ChartLegend, type LegendSeries } from "../ChartLegend";
import { ChartTooltip } from "../ChartTooltip";
import "./CategoryChart.css";

export interface CategoryBar {
  category: string;
  value: number;
  color?: string;
}

export interface CategoryChartProps extends HTMLAttributes<HTMLDivElement> {
  data: CategoryBar[];
  width?: number;
  height?: number;
  padding?: number;
  orientation?: "vertical" | "horizontal";
  defaultColor?: string;
  ariaLabel?: string;
  seriesLabel?: string;
  formatValue?: (n: number) => string;
  emptyMessage?: string;
}

export const CategoryChart = forwardRef<HTMLDivElement, CategoryChartProps>(
  function CategoryChart(
    {
      data,
      width = 480,
      height = 240,
      padding = 32,
      orientation = "vertical",
      defaultColor = "var(--color-action-primary)",
      ariaLabel = "Category chart",
      seriesLabel = "Value",
      formatValue = (n: number) => String(n),
      emptyMessage,
      className,
      ...rest
    },
    ref,
  ) {
    const [hover, setHover] = useState<
      | { category: string; value: number; x: number; y: number }
      | null
    >(null);

    const classes = [
      "ui-category-chart",
      `ui-category-chart--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (data.length === 0) {
      return (
        <Box
          ref={ref as React.Ref<HTMLElement>}
          direction="column"
          gap="2"
          className={classes}
          {...rest}
        >
          <EmptyChart height={height} message={emptyMessage} />
        </Box>
      );
    }

    const max = Math.max(...data.map((d) => d.value), 1);
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const legendSeries: LegendSeries[] = [
      { id: "primary", label: seriesLabel, color: defaultColor },
    ];

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="column"
        gap="2"
        className={classes}
        {...rest}
      >
        <Box className="ui-category-chart__plot">
          <svg
            className="ui-category-chart__svg"
            width="100%"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel}
          >
            {orientation === "vertical"
              ? data.map((d, i) => {
                  const slot = chartW / data.length;
                  const barW = slot * 0.6;
                  const h = (d.value / max) * chartH;
                  const x = padding + slot * i + (slot - barW) / 2;
                  const y = padding + chartH - h;
                  return (
                    <g key={d.category}>
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={h}
                        fill={d.color ?? defaultColor}
                        rx={2}
                        onMouseEnter={() =>
                          setHover({
                            category: d.category,
                            value: d.value,
                            x: x + barW / 2,
                            y,
                          })
                        }
                        onMouseLeave={() => setHover(null)}
                      >
                        <title>
                          {d.category}: {formatValue(d.value)}
                        </title>
                      </rect>
                    </g>
                  );
                })
              : data.map((d, i) => {
                  const slot = chartH / data.length;
                  const barH = slot * 0.6;
                  const w = (d.value / max) * chartW;
                  const y = padding + slot * i + (slot - barH) / 2;
                  return (
                    <rect
                      key={d.category}
                      x={padding}
                      y={y}
                      width={w}
                      height={barH}
                      fill={d.color ?? defaultColor}
                      rx={2}
                      onMouseEnter={() =>
                        setHover({
                          category: d.category,
                          value: d.value,
                          x: padding + w,
                          y: y + barH / 2,
                        })
                      }
                      onMouseLeave={() => setHover(null)}
                    >
                      <title>
                        {d.category}: {formatValue(d.value)}
                      </title>
                    </rect>
                  );
                })}
          </svg>
          {hover && (
            <ChartTooltip
              title={hover.category}
              rows={[{ label: seriesLabel, value: formatValue(hover.value) }]}
              position={{ x: hover.x, y: hover.y }}
            />
          )}
        </Box>
        <Box
          direction="row"
          justify="between"
          align="center"
          className="ui-category-chart__chrome"
        >
          <Text as="span" size="xs" color="secondary">
            {data.length} categor{data.length === 1 ? "y" : "ies"}
          </Text>
          <ChartLegend series={legendSeries} />
        </Box>
      </Box>
    );
  },
);

CategoryChart.displayName = "CategoryChart";
