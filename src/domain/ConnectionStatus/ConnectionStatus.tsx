import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Dot } from "../../primitives/Dot";
import { Spinner } from "../../primitives/Spinner";
import { Text } from "../../primitives/Text";
import { formatDate } from "../../utils";
import "./ConnectionStatus.css";

export type ConnectionState = "connected" | "connecting" | "disconnected" | "recovered";

export interface ConnectionStatusProps extends HTMLAttributes<HTMLSpanElement> {
  status: ConnectionState;
  lastUpdated?: Date | string | number | null;
  onRetry?: () => void;
  locale?: string;
}

const LABELS: Record<ConnectionState, string> = {
  connected: "Connected",
  connecting: "Connecting…",
  disconnected: "Disconnected",
  recovered: "Reconnected",
};

const TONES: Record<ConnectionState, "success" | "warning" | "error" | "neutral"> = {
  connected: "success",
  connecting: "warning",
  disconnected: "error",
  recovered: "success",
};

export const ConnectionStatus = forwardRef<HTMLSpanElement, ConnectionStatusProps>(
  function ConnectionStatus(
    { status, lastUpdated, onRetry, locale, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-connection-status",
      `ui-connection-status--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const label = LABELS[status];
    const meta =
      lastUpdated != null ? formatDate(lastUpdated, { format: "relative", locale }) : null;
    const ariaLive = status === "disconnected" ? "assertive" : "polite";

    return (
      <span
        ref={ref}
        className={classes}
        role="status"
        aria-live={ariaLive}
        {...rest}
      >
        <span className="ui-connection-status__indicator" aria-hidden="true">
          {status === "connecting" ? <Spinner size="sm" /> : <Dot color={TONES[status]} size="sm" />}
        </span>
        <Text as="span" size="sm" className="ui-connection-status__label">{label}</Text>
        {meta && (
          <Text as="span" size="xs" color="tertiary" className="ui-connection-status__meta">
            · {meta}
          </Text>
        )}
        {onRetry && status === "disconnected" && (
          <Button variant="ghost" size="sm" className="ui-connection-status__retry" onClick={onRetry}>
            Retry
          </Button>
        )}
      </span>
    );
  },
);
