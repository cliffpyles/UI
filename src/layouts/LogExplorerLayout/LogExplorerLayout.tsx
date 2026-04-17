import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./LogExplorerLayout.css";

export interface LogExplorerLayoutProps extends HTMLAttributes<HTMLDivElement> {
  searchBar: ReactNode;
  logs: ReactNode;
  timeWindow?: ReactNode;
  fields?: ReactNode;
  searchBarLabel?: string;
  fieldsLabel?: string;
  logsLabel?: string;
}

export const LogExplorerLayout = forwardRef<
  HTMLDivElement,
  LogExplorerLayoutProps
>(function LogExplorerLayout(
  {
    searchBar,
    logs,
    timeWindow,
    fields,
    searchBarLabel = "Log search",
    fieldsLabel = "Fields",
    logsLabel = "Log stream",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-log-explorer", className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={classes} {...rest}>
      <header className="ui-log-explorer__search" aria-label={searchBarLabel}>
        <div className="ui-log-explorer__search-bar">{searchBar}</div>
        {timeWindow && (
          <div className="ui-log-explorer__time-window">{timeWindow}</div>
        )}
      </header>
      <div className="ui-log-explorer__body">
        {fields && (
          <aside className="ui-log-explorer__fields" aria-label={fieldsLabel}>
            {fields}
          </aside>
        )}
        <section className="ui-log-explorer__logs" aria-label={logsLabel}>
          {logs}
        </section>
      </div>
    </div>
  );
});
