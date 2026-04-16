import { forwardRef, type HTMLAttributes } from "react";
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
      <div ref={ref} className={classes} {...rest}>
        <ol className="ui-version-history__list">
          {versions.map((v) => (
            <li
              key={v.id}
              className={
                "ui-version-history__item" +
                (v.id === current ? " ui-version-history__item--current" : "")
              }
            >
              <div className="ui-version-history__header">
                <span className="ui-version-history__label">{v.label}</span>
                {v.id === current && (
                  <span className="ui-version-history__current">Current</span>
                )}
                <Timestamp
                  date={v.timestamp}
                  format="auto"
                  className="ui-version-history__time"
                />
              </div>
              {v.actor && <UserChip user={v.actor} size="sm" />}
              {v.note && <div className="ui-version-history__note">{v.note}</div>}
              <div className="ui-version-history__actions">
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
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  },
);
