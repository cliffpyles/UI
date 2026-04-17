import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
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
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="2"
        {...rest}
      >
        <Box
          className="ui-audit-entry__header"
          display="flex"
          align="center"
          gap="2"
          wrap
        >
          <UserChip user={entry.actor} size="sm" />
          <Text as="span" color="primary">
            {entry.action}
            {entry.resource && (
              <Text
                as="span"
                weight="medium"
                color="secondary"
              >
                {" "}
                {entry.resource}
              </Text>
            )}
          </Text>
          <Timestamp date={entry.timestamp} format="auto" className="ui-audit-entry__time" />
        </Box>
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
      </Box>
    );
  },
);
