import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type CSSProperties,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { VisuallyHidden } from "../../primitives/VisuallyHidden";
import { Skeleton } from "../../components/Skeleton";
import { ChartTooltip } from "../ChartTooltip";
import { EmptyChart } from "../EmptyChart";
import { formatNumber } from "../../utils";
import "./DistributionChart.css";

export type DistributionMode = "histogram" | "density";

export interface DistributionBucket {
  min: number;
  max: number;
  count: number;
}

export interface DistributionChartProps extends HTMLAttributes<HTMLDivElement> {
  values: number[];
  mode?: DistributionMode;
  bucketCount?: number;
  buckets?: DistributionBucket[];
  height?: number;
  loading?: boolean;
  formatValue?: (n: number) => string;
  emptyMessage?: string;
}

const DEFAULT_HEIGHT = 240;
const PADDING_X = 32;
const PADDING_Y = 24;
const VIEW_WIDTH = 480;

function sturgesBucketCount(n: number): number {
  if (n <= 1) return 1;
  return Math.max(1, Math.ceil(Math.log2(n) + 1));
}

function computeBuckets(values: number[], count: number): DistributionBucket[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = range / count;
  const buckets: DistributionBucket[] = Array.from({ length: count }, (_, i) => ({
    min: min + step * i,
    max: min + step * (i + 1),
    count: 0,
  }));
  for (const v of values) {
    const idx = Math.min(count - 1, Math.floor((v - min) / step));
    buckets[idx].count++;
  }
  return buckets;
}

function computeDensity(
  values: number[],
  resolution: number,
): { points: { x: number; y: number }[]; min: number; max: number } {
  if (values.length === 0) return { points: [], min: 0, max: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const bandwidth = range / Math.max(8, Math.sqrt(values.length));
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= resolution; i++) {
    const x = min + (range * i) / resolution;
    let y = 0;
    for (const v of values) {
      const u = (x - v) / bandwidth;
      y += Math.exp(-0.5 * u * u);
    }
    y /= values.length * bandwidth * Math.sqrt(2 * Math.PI);
    points.push({ x, y });
  }
  return { points, min, max };
}

export const DistributionChart = forwardRef<
  HTMLDivElement,
  DistributionChartProps
>(function DistributionChart(
  {
    values,
    mode = "histogram",
    bucketCount,
    buckets: bucketsProp,
    height = DEFAULT_HEIGHT,
    loading = false,
    formatValue,
    emptyMessage,
    className,
    ...rest
  },
  ref,
) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const fmt = formatValue ?? ((n: number) => formatNumber(n, { decimals: 2 }));

  const buckets = useMemo<DistributionBucket[]>(() => {
    if (bucketsProp) return bucketsProp;
    if (values.length === 0) return [];
    const count = bucketCount ?? sturgesBucketCount(values.length);
    return computeBuckets(values, count);
  }, [values, bucketCount, bucketsProp]);

  const density = useMemo(
    () => (mode === "density" ? computeDensity(values, 64) : null),
    [mode, values],
  );

  const classes = ["ui-distribution-chart", className].filter(Boolean).join(" ");
  const rootStyle: CSSProperties = { ...(rest.style ?? {}) };

  if (loading) {
    return (
      <div ref={ref} className={classes} {...rest} style={rootStyle}>
        <Skeleton variant="rect" width="100%" height={height} />
      </div>
    );
  }

  const isEmpty =
    !bucketsProp &&
    values.length === 0 &&
    (!density || density.points.length === 0);
  if (isEmpty) {
    return (
      <div ref={ref} className={classes} {...rest} style={rootStyle}>
        <EmptyChart height={height} message={emptyMessage} />
      </div>
    );
  }

  const chartW = VIEW_WIDTH - PADDING_X * 2;
  const chartH = height - PADDING_Y * 2;

  let marks: React.ReactNode = null;
  let summary = "";
  let hoverContent: React.ReactNode = null;

  if (mode === "density" && density && density.points.length > 0) {
    const maxY = Math.max(...density.points.map((p) => p.y), 1e-9);
    const xRange = density.max - density.min || 1;
    const path = density.points
      .map((p, i) => {
        const x = PADDING_X + ((p.x - density.min) / xRange) * chartW;
        const y = PADDING_Y + chartH - (p.y / maxY) * chartH;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
    const last = density.points[density.points.length - 1];
    const lastX = PADDING_X + ((last.x - density.min) / xRange) * chartW;
    const baseY = PADDING_Y + chartH;
    const fillPath = `${path} L${lastX.toFixed(2)},${baseY} L${PADDING_X},${baseY} Z`;
    marks = (
      <path
        d={fillPath}
        className="ui-distribution-chart__density"
      />
    );
    summary = `Density curve from ${fmt(density.min)} to ${fmt(density.max)}`;
  } else if (buckets.length > 0) {
    const maxCount = Math.max(...buckets.map((b) => b.count), 1);
    const slot = chartW / buckets.length;
    marks = buckets.map((b, i) => {
      const h = (b.count / maxCount) * chartH;
      return (
        <rect
          key={i}
          x={PADDING_X + slot * i + 1}
          y={PADDING_Y + chartH - h}
          width={Math.max(0, slot - 2)}
          height={h}
          className="ui-distribution-chart__bar"
          role="img"
          tabIndex={0}
          aria-label={`${fmt(b.min)} to ${fmt(b.max)}: ${b.count}`}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx((h) => (h === i ? null : h))}
          onFocus={() => setHoverIdx(i)}
          onBlur={() => setHoverIdx((h) => (h === i ? null : h))}
        />
      );
    });
    summary = `Distribution of ${values.length} values across ${buckets.length} buckets`;
    if (hoverIdx != null && buckets[hoverIdx]) {
      const b = buckets[hoverIdx];
      hoverContent = (
        <ChartTooltip
          header={`${fmt(b.min)} – ${fmt(b.max)}`}
          rows={[
            {
              id: "count",
              label: "Count",
              value: fmt(b.count),
              color: "var(--chart-series-1)",
            },
          ]}
        />
      );
    }
  }

  return (
    <div
      ref={ref}
      className={classes}
      role="img"
      aria-label={summary}
      {...rest}
      style={rootStyle}
    >
      <Box direction="column" gap="2">
        <div className="ui-distribution-chart__viewport">
          <svg
            className="ui-distribution-chart__svg"
            width="100%"
            viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
            preserveAspectRatio="none"
          >
            {marks}
          </svg>
          {hoverContent && (
            <div className="ui-distribution-chart__tooltip-layer">
              {hoverContent}
            </div>
          )}
        </div>
        {buckets.length > 0 && (
          <Box
            direction="row"
            justify="between"
            className="ui-distribution-chart__axis"
          >
            <Text size="xs" color="secondary">
              {fmt(buckets[0].min)}
            </Text>
            <Text size="xs" color="secondary">
              {fmt(buckets[buckets.length - 1].max)}
            </Text>
          </Box>
        )}
      </Box>
      <VisuallyHidden as="span">
        <table>
          <thead>
            <tr>
              <th>Range</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((b, i) => (
              <tr key={i}>
                <td>
                  {fmt(b.min)} – {fmt(b.max)}
                </td>
                <td>{b.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </div>
  );
});
