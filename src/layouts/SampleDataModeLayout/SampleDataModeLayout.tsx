import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../../components/Button";
import "./SampleDataModeLayout.css";

export interface SampleDataModeLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  banner?: ReactNode;
  children: ReactNode;
  onSwitchToReal?: () => void;
  ctaLabel?: string;
}

export const SampleDataModeLayout = forwardRef<
  HTMLDivElement,
  SampleDataModeLayoutProps
>(function SampleDataModeLayout(
  {
    banner = "You're viewing sample data",
    children,
    onSwitchToReal,
    ctaLabel = "Switch to real data",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-sample-data-mode", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Sample data mode"
      className={classes}
      {...rest}
    >
      <div className="ui-sample-data-mode__banner" role="status">
        <span className="ui-sample-data-mode__banner-text">{banner}</span>
        {onSwitchToReal && (
          <Button
            variant="ghost"
            size="sm"
            className="ui-sample-data-mode__cta"
            onClick={onSwitchToReal}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
      <div className="ui-sample-data-mode__content">{children}</div>
    </div>
  );
});
