import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Skeleton } from "../../components/Skeleton";
import { ErrorState } from "../../components/ErrorState";
import { Tooltip } from "../../components/Tooltip";
import { Box } from "../../primitives/Box";
import { Icon } from "../../primitives/Icon";
import { MetricValue, type MetricFormat } from "../MetricValue";
import { TrendIndicator, type TrendDirection } from "../TrendIndicator";
import { Sparkline } from "../Sparkline";
import "./MetricCard.css";

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: number | null;
  format?: MetricFormat;
  unit?: string;
  precision?: number;
  compact?: boolean;
  currency?: string;
  locale?: string;
  /** Percent change vs target/previous. */
  trend?: { value: number; direction?: TrendDirection; invert?: boolean; label?: string };
  sparkline?: number[];
  info?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  footer?: ReactNode;
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    {
      label,
      value,
      format,
      unit,
      precision,
      compact,
      currency,
      locale,
      trend,
      sparkline,
      info,
      loading,
      error,
      onRetry,
      footer,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-metric-card", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="2"
        {...rest}
      >
        <Box
          className="ui-metric-card__header"
          display="flex"
          align="center"
          justify="between"
          gap="2"
        >
          <span className="ui-metric-card__label">{label}</span>
          {info && (
            <Tooltip content={info}>
              <span className="ui-metric-card__info" aria-label={`About ${label}`}>
                <Icon name="info" size="xs" />
              </span>
            </Tooltip>
          )}
        </Box>

        {loading ? (
          <Box
            className="ui-metric-card__body"
            display="flex"
            direction="column"
            gap="1"
          >
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="40%" height="1rem" />
          </Box>
        ) : error ? (
          <ErrorState
            title="Failed to load"
            description={error}
            onRetry={onRetry}
          />
        ) : (
          <Box
            className="ui-metric-card__body"
            display="flex"
            direction="column"
            gap="1"
          >
            <MetricValue
              className="ui-metric-card__value"
              value={value}
              format={format}
              unit={unit}
              precision={precision}
              compact={compact}
              currency={currency}
              locale={locale}
            />
            <Box
              className="ui-metric-card__meta"
              display="flex"
              align="center"
              justify="between"
              gap="2"
            >
              {trend && (
                <TrendIndicator
                  value={trend.value}
                  direction={trend.direction}
                  invert={trend.invert}
                  label={trend.label}
                  locale={locale}
                />
              )}
              {sparkline && sparkline.length > 1 && (
                <Sparkline data={sparkline} label={`${label} trend`} />
              )}
            </Box>
          </Box>
        )}

        {footer && !loading && !error && (
          <div className="ui-metric-card__footer">{footer}</div>
        )}
      </Box>
    );
  },
);
