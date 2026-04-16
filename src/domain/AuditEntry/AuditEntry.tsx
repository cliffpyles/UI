import { forwardRef, type HTMLAttributes } from "react";
import { UserChip } from "../UserChip";
import { Timestamp } from "../Timestamp";
import type { UserData } from "../UserAvatar";
import "./AuditEntry.css";

export interface AuditRecord {
  id: string;
  actor: UserData;
  action: string;
  resource?: string;
  timestamp: Date | string | number;
  ip?: string;
  userAgent?: string;
  detail?: string;
}

export interface AuditEntryProps extends HTMLAttributes<HTMLDivElement> {
  entry: AuditRecord;
}

export const AuditEntry = forwardRef<HTMLDivElement, AuditEntryProps>(
  function AuditEntry({ entry, className, ...rest }, ref) {
    const classes = ["ui-audit-entry", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-audit-entry__header">
          <UserChip user={entry.actor} size="sm" />
          <span className="ui-audit-entry__action">
            {entry.action}
            {entry.resource && <span className="ui-audit-entry__resource"> {entry.resource}</span>}
          </span>
          <Timestamp date={entry.timestamp} format="auto" className="ui-audit-entry__time" />
        </div>
        <dl className="ui-audit-entry__meta">
          {entry.ip && (
            <>
              <dt>IP</dt>
              <dd>{entry.ip}</dd>
            </>
          )}
          {entry.userAgent && (
            <>
              <dt>Agent</dt>
              <dd>{entry.userAgent}</dd>
            </>
          )}
        </dl>
        {entry.detail && <div className="ui-audit-entry__detail">{entry.detail}</div>}
      </div>
    );
  },
);
