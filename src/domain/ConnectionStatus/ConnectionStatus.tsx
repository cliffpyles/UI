import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Icon } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
import { LiveIndicator } from "../LiveIndicator";
import { Timestamp } from "../Timestamp";
import "./ConnectionStatus.css";

export type ConnectionState = "live" | "reconnecting" | "offline";

export interface ConnectionStatusProps extends HTMLAttributes<HTMLDivElement> {
  state: ConnectionState;
  lastUpdated?: Date | string | number | null;
  label?: string;
}

const DEFAULT_LABELS: Record<ConnectionState, string> = {
  live: "Live",
  reconnecting: "Reconnecting…",
  offline: "Offline",
};

export const ConnectionStatus = forwardRef<HTMLDivElement, ConnectionStatusProps>(
  function ConnectionStatus(
    { state, lastUpdated, label, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-connection-status",
      `ui-connection-status--${state}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const copy = label ?? DEFAULT_LABELS[state];

    return (
      <Box
        ref={ref}
        as="div"
        role="status"
        aria-live="polite"
        className={classes}
        direction="row"
        align="center"
        gap="2"
        {...rest}
      >
        {state === "offline" ? (
          <Icon name="wifi-off" size="sm" aria-hidden />
        ) : (
          <LiveIndicator active={state === "live"} label={copy} />
        )}
        {state !== "live" && (
          <Text as="span" size="caption" color="secondary" className="ui-connection-status__label">
            {copy}
          </Text>
        )}
        {lastUpdated != null && state !== "live" && (
          <Text as="span" size="caption" color="tertiary" className="ui-connection-status__meta">
            <Timestamp date={lastUpdated} format="relative" />
          </Text>
        )}
      </Box>
    );
  },
);
