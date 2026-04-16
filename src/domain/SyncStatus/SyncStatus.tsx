import { forwardRef, type HTMLAttributes } from "react";
import { Icon } from "../../primitives/Icon";
import { Spinner } from "../../primitives/Spinner";
import { formatDate } from "../../utils";
import "./SyncStatus.css";

export type SyncState = "synced" | "syncing" | "error" | "paused" | "offline";

export interface SyncStatusProps extends HTMLAttributes<HTMLSpanElement> {
  status: SyncState;
  lastSynced?: Date | string | number | null;
  label?: string;
  onRetry?: () => void;
  locale?: string;
}

const LABELS: Record<SyncState, string> = {
  synced: "Synced",
  syncing: "Syncing…",
  error: "Sync failed",
  paused: "Paused",
  offline: "Offline",
};

export const SyncStatus = forwardRef<HTMLSpanElement, SyncStatusProps>(
  function SyncStatus(
    { status, lastSynced, label, onRetry, locale, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-sync-status",
      `ui-sync-status--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const text = label ?? LABELS[status];
    const relative =
      lastSynced != null ? formatDate(lastSynced, { format: "relative", locale }) : null;

    return (
      <span ref={ref} className={classes} role="status" {...rest}>
        <span className="ui-sync-status__icon" aria-hidden="true">
          {status === "syncing" ? (
            <Spinner size="sm" />
          ) : status === "error" ? (
            <Icon name="alert-triangle" size="xs" color="error" />
          ) : status === "paused" ? (
            <Icon name="clock" size="xs" color="secondary" />
          ) : status === "offline" ? (
            <Icon name="eye-off" size="xs" color="secondary" />
          ) : (
            <Icon name="refresh" size="xs" color="success" />
          )}
        </span>
        <span className="ui-sync-status__label">{text}</span>
        {relative && status !== "syncing" && (
          <span className="ui-sync-status__meta">· {relative}</span>
        )}
        {onRetry && status === "error" && (
          <button type="button" className="ui-sync-status__retry" onClick={onRetry}>
            Retry
          </button>
        )}
      </span>
    );
  },
);
