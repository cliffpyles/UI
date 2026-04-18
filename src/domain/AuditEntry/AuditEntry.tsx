import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { UserChip } from "../UserChip";
import { Timestamp } from "../Timestamp";
import type { UserData } from "../UserAvatar";
import "./AuditEntry.css";

/**
 * Kept for backwards-compatible callers. Prefer the flat props API below,
 * which matches design/components/domain/AuditEntry.md.
 */
export interface AuditRecord {
  id: string;
  actor: UserData;
  action: string;
  resource?: string;
  timestamp: Date | string | number;
  ip?: string;
  userAgent?: string;
  detail?: ReactNode;
}

export interface AuditEntryProps extends HTMLAttributes<HTMLElement> {
  actor: UserData;
  action: string;
  occurredAt: Date | string | number;
  ip?: string;
  userAgent?: string;
  detail?: ReactNode;
}

export const AuditEntry = forwardRef<HTMLElement, AuditEntryProps>(
  function AuditEntry(
    { actor, action, occurredAt, ip, userAgent, detail, className, ...rest },
    ref,
  ) {
    const classes = ["ui-audit-entry", className].filter(Boolean).join(" ");
    const label = `${actor.name} ${action}`;

    return (
      <Box
        as="article"
        ref={ref as React.Ref<HTMLElement>}
        aria-label={label}
        direction="column"
        gap="2"
        className={classes}
        {...rest}
      >
        <Box
          direction="row"
          align="center"
          gap="2"
          wrap
          className="ui-audit-entry__header"
        >
          <UserChip user={actor} size="sm" />
          <Text as="span" size="sm" weight="medium">
            {action}
          </Text>
          <Timestamp
            date={occurredAt}
            format="auto"
            className="ui-audit-entry__time"
          />
        </Box>
        {(ip || userAgent) && (
          <Box
            direction="row"
            gap="4"
            wrap
            className="ui-audit-entry__meta"
          >
            {ip && (
              <Text as="span" family="mono" size="sm" color="secondary">
                {ip}
              </Text>
            )}
            {userAgent && (
              <Text as="span" family="mono" size="sm" color="secondary">
                {userAgent}
              </Text>
            )}
          </Box>
        )}
        {detail && (
          <Text as="p" size="sm" color="secondary" className="ui-audit-entry__detail">
            {detail}
          </Text>
        )}
      </Box>
    );
  },
);

AuditEntry.displayName = "AuditEntry";
