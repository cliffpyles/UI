import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { UserChip } from "../UserChip";
import { Timestamp } from "../Timestamp";
import type { UserData } from "../UserAvatar";
import "./VersionHistory.css";

export interface Version {
  id: string;
  label: string;
  actor?: UserData;
  timestamp: Date | string | number;
  note?: string;
}

export interface VersionHistoryProps extends HTMLAttributes<HTMLDivElement> {
  versions: Version[];
  current?: string;
  onRestore?: (id: string) => void;
  onCompare?: (id: string) => void;
}

export const VersionHistory = forwardRef<HTMLDivElement, VersionHistoryProps>(
  function VersionHistory(
    { versions, current, onRestore, onCompare, className, ...rest },
    ref,
  ) {
    const classes = ["ui-version-history", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="2"
        {...rest}
      >
        <ol className="ui-version-history__list">
          {versions.map((v) => (
            <li
              key={v.id}
              className={
                "ui-version-history__item" +
                (v.id === current ? " ui-version-history__item--current" : "")
              }
            >
              <Box
                className="ui-version-history__header"
                display="flex"
                align="center"
                gap="2"
              >
                <Text as="span" weight="semibold" color="primary">
                  {v.label}
                </Text>
                {v.id === current && (
                  <span className="ui-version-history__current">Current</span>
                )}
                <Timestamp
                  date={v.timestamp}
                  format="auto"
                  className="ui-version-history__time"
                />
              </Box>
              {v.actor && <UserChip user={v.actor} size="sm" />}
              {v.note && <div className="ui-version-history__note">{v.note}</div>}
              <Box
                className="ui-version-history__actions"
                display="inline-flex"
                gap="1"
              >
                {onCompare && (
                  <Button variant="ghost" size="sm" onClick={() => onCompare(v.id)}>
                    Compare
                  </Button>
                )}
                {onRestore && v.id !== current && (
                  <Button variant="secondary" size="sm" onClick={() => onRestore(v.id)}>
                    Restore
                  </Button>
                )}
              </Box>
            </li>
          ))}
        </ol>
      </Box>
    );
  },
);
