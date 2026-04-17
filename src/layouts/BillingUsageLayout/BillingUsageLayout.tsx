import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./BillingUsageLayout.css";

export interface UsageMeter {
  id: string;
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export interface BillingUsageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  plan: ReactNode;
  usage: UsageMeter[];
  invoices?: ReactNode;
  upgrade?: ReactNode;
  label?: string;
}

export const BillingUsageLayout = forwardRef<HTMLDivElement, BillingUsageLayoutProps>(
  function BillingUsageLayout(
    { plan, usage, invoices, upgrade, label = "Billing and usage", className, ...rest },
    ref,
  ) {
    const classes = ["ui-billing-usage", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        <div
          className="ui-billing-usage__plan"
          role="group"
          aria-label="Current plan"
        >
          <div className="ui-billing-usage__plan-body">{plan}</div>
          {upgrade && (
            <div className="ui-billing-usage__upgrade">{upgrade}</div>
          )}
        </div>
        <div
          className="ui-billing-usage__usage"
          role="group"
          aria-label="Usage"
        >
          <h3 className="ui-billing-usage__heading">Usage</h3>
          <ul className="ui-billing-usage__meters">
            {usage.map((m) => {
              const pct = m.limit > 0 ? Math.min(100, (m.current / m.limit) * 100) : 0;
              const over = m.current > m.limit;
              return (
                <li key={m.id} className="ui-billing-usage__meter">
                  <div className="ui-billing-usage__meter-head">
                    <span className="ui-billing-usage__meter-label">
                      {m.label}
                    </span>
                    <span className="ui-billing-usage__meter-value">
                      {m.current} / {m.limit}
                      {m.unit ? ` ${m.unit}` : ""}
                    </span>
                  </div>
                  <div
                    className={[
                      "ui-billing-usage__bar",
                      over && "ui-billing-usage__bar--over",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    role="progressbar"
                    aria-label={m.label}
                    aria-valuemin={0}
                    aria-valuemax={m.limit}
                    aria-valuenow={m.current}
                  >
                    <div
                      className="ui-billing-usage__bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {invoices && (
          <div
            className="ui-billing-usage__invoices"
            role="group"
            aria-label="Invoices"
          >
            <h3 className="ui-billing-usage__heading">Invoices</h3>
            {invoices}
          </div>
        )}
      </div>
    );
  },
);
