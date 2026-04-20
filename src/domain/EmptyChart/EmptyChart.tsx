import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { EmptyState } from "../../components/EmptyState";
import "./EmptyChart.css";

export interface EmptyChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Container height in px so layout doesn't collapse. Default 240. */
  height?: number;
  /** Title text — default "No data to display". */
  title?: string;
  /** Description text — default explains the empty range. */
  description?: string;
  /** @deprecated Use `description`. */
  message?: string;
  /** Optional CTA. */
  action?: ReactNode;
  /** Override the default empty illustration / icon. */
  illustration?: ReactNode;
}

const DEFAULT_TITLE = "No data to display";
const DEFAULT_DESCRIPTION = "There is no data for the selected range.";

export const EmptyChart = forwardRef<HTMLDivElement, EmptyChartProps>(
  function EmptyChart(
    {
      height = 240,
      title = DEFAULT_TITLE,
      description,
      message,
      action,
      illustration,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-empty-chart", className].filter(Boolean).join(" ");
    const mergedStyle: CSSProperties = {
      minHeight: height,
      ...style,
    };
    const resolvedDescription = description ?? message ?? DEFAULT_DESCRIPTION;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        role="status"
        direction="column"
        align="center"
        justify="center"
        padding="6"
        className={classes}
        style={mergedStyle}
        {...rest}
      >
        <EmptyState
          title={title}
          description={resolvedDescription}
          action={action}
          icon={illustration}
        />
      </Box>
    );
  },
);
