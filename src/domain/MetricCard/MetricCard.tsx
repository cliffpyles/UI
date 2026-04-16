import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Skeleton } from "../../components/Skeleton";
import { ErrorState } from "../../components/ErrorState";
import { Tooltip } from "../../components/Tooltip";
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
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-metric-card__header">
          <span className="ui-metric-card__label">{label}</span>
          {info && (
            <Tooltip content={info}>
              <span className="ui-metric-card__info" aria-label={`About ${label}`}>
                <Icon name="info" size="xs" />
              </span>
            </Tooltip>
          )}
        </div>

        {loading ? (
          <div className="ui-metric-card__body">
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load"
            description={error}
            onRetry={onRetry}
          />
        ) : (
          <div className="ui-metric-card__body">
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
            <div className="ui-metric-card__meta">
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
            </div>
          </div>
        )}

        {footer && !loading && !error && (
          <div className="ui-metric-card__footer">{footer}</div>
        )}
      </div>
    );
  },
);
