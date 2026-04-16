import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../primitives/Icon";
import "./ChartHeader.css";

export interface ChartHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  timeRange?: ReactNode;
  onExport?: () => void;
  actions?: ReactNode;
}

export const ChartHeader = forwardRef<HTMLElement, ChartHeaderProps>(
  function ChartHeader(
    { title, subtitle, timeRange, onExport, actions, className, ...rest },
    ref,
  ) {
    const classes = ["ui-chart-header", className].filter(Boolean).join(" ");

    return (
      <header ref={ref} className={classes} {...rest}>
        <div className="ui-chart-header__text">
          <h3 className="ui-chart-header__title">{title}</h3>
          {subtitle && <div className="ui-chart-header__subtitle">{subtitle}</div>}
        </div>
        <div className="ui-chart-header__right">
          {timeRange}
          {actions}
          {onExport && (
            <Button variant="ghost" size="sm" onClick={onExport} aria-label="Export chart">
              <Icon name="download" size="xs" aria-hidden />
            </Button>
          )}
        </div>
      </header>
    );
  },
);
