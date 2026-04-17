import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { EmptyChart } from "../EmptyChart";
import "./FunnelChart.css";

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelChartProps extends HTMLAttributes<HTMLDivElement> {
  stages: FunnelStage[];
  color?: string;
  ariaLabel?: string;
}

export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  function FunnelChart(
    {
      stages,
      color = "var(--color-action-primary)",
      ariaLabel = "Funnel chart",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-funnel-chart", className].filter(Boolean).join(" ");

    if (stages.length === 0) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <EmptyChart />
        </div>
      );
    }

    const max = Math.max(...stages.map((s) => s.value), 1);

    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="3"
        role="figure"
        aria-label={ariaLabel}
        {...rest}
      >
        {stages.map((s, i) => {
          const prev = i === 0 ? null : stages[i - 1];
          const pct = (s.value / max) * 100;
          const conv = prev && prev.value > 0 ? (s.value / prev.value) * 100 : null;
          return (
            <Box
              key={s.label}
              className="ui-funnel-chart__stage"
              display="flex"
              direction="column"
              gap="1"
            >
              <Box
                className="ui-funnel-chart__header"
                display="flex"
                justify="between"
              >
                <Text as="span" weight="medium" color="primary">
                  {s.label}
                </Text>
                <Text as="span" color="primary" tabularNums>
                  {s.value.toLocaleString()}
                </Text>
              </Box>
              <div
                className="ui-funnel-chart__bar"
                style={{ width: `${pct}%`, background: color }}
              />
              {conv != null && (
                <Text
                  as="span"
                  size="xs"
                  color="tertiary"
                  className="ui-funnel-chart__conversion"
                >
                  {conv.toFixed(1)}% conversion
                </Text>
              )}
            </Box>
          );
        })}
      </Box>
    );
  },
);
