import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
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
    <Box
      ref={ref as Ref<HTMLElement>}
      direction="column"
      className={classes}
      {...rest}
    >
      <Box
        as="header"
        align="center"
        gap="3"
        className="ui-log-explorer__search"
        aria-label={searchBarLabel}
      >
        <div className="ui-log-explorer__search-bar">{searchBar}</div>
        {timeWindow && (
          <div className="ui-log-explorer__time-window">{timeWindow}</div>
        )}
      </Box>
      <Box display="flex" className="ui-log-explorer__body">
        {fields && (
          <aside className="ui-log-explorer__fields" aria-label={fieldsLabel}>
            {fields}
          </aside>
        )}
        <section className="ui-log-explorer__logs" aria-label={logsLabel}>
          {logs}
        </section>
      </Box>
    </Box>
  );
});
