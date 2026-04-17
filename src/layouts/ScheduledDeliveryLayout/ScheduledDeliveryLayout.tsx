import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./ScheduledDeliveryLayout.css";

export interface ScheduledDeliveryLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  frequency: ReactNode;
  recipients: ReactNode;
  format?: ReactNode;
  window?: ReactNode;
  footer?: ReactNode;
}

export const ScheduledDeliveryLayout = forwardRef<
  HTMLDivElement,
  ScheduledDeliveryLayoutProps
>(function ScheduledDeliveryLayout(
  { frequency, recipients, format, window, footer, className, ...rest },
  ref,
) {
  const classes = ["ui-scheduled-delivery", className].filter(Boolean).join(" ");
  return (
    <div
      ref={ref}
      className={classes}
      role="region"
      aria-label="Scheduled delivery"
      {...rest}
    >
      <section
        className="ui-scheduled-delivery__section"
        aria-label="Delivery frequency"
      >
        {frequency}
      </section>
      <section
        className="ui-scheduled-delivery__section"
        aria-label="Recipients"
      >
        {recipients}
      </section>
      {format && (
        <section
          className="ui-scheduled-delivery__section"
          aria-label="Delivery format"
        >
          {format}
        </section>
      )}
      {window && (
        <section
          className="ui-scheduled-delivery__section"
          aria-label="Delivery window"
        >
          {window}
        </section>
      )}
      {footer && (
        <div className="ui-scheduled-delivery__footer">{footer}</div>
      )}
    </div>
  );
});
