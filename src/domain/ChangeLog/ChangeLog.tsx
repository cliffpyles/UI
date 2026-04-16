import { forwardRef, type HTMLAttributes } from "react";
import { UserChip } from "../UserChip";
import { Timestamp } from "../Timestamp";
import type { UserData } from "../UserAvatar";
import "./ChangeLog.css";

export interface FieldChange {
  field: string;
  before: string | number | boolean | null;
  after: string | number | boolean | null;
}

export interface ChangeLogProps extends HTMLAttributes<HTMLDivElement> {
  changes: FieldChange[];
  actor?: UserData;
  timestamp?: Date | string | number;
  title?: string;
}

function display(v: FieldChange["before"]): string {
  if (v == null) return "\u2014";
  return String(v);
}

export const ChangeLog = forwardRef<HTMLDivElement, ChangeLogProps>(
  function ChangeLog({ changes, actor, timestamp, title, className, ...rest }, ref) {
    const classes = ["ui-changelog", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {(title || actor || timestamp) && (
          <div className="ui-changelog__header">
            {actor && <UserChip user={actor} size="sm" />}
            {title && <span className="ui-changelog__title">{title}</span>}
            {timestamp && (
              <Timestamp
                date={timestamp}
                format="auto"
                className="ui-changelog__time"
              />
            )}
          </div>
        )}
        <ul className="ui-changelog__list">
          {changes.map((c) => (
            <li key={c.field} className="ui-changelog__item">
              <span className="ui-changelog__field">{c.field}</span>
              <span className="ui-changelog__before">{display(c.before)}</span>
              <span className="ui-changelog__arrow" aria-hidden="true">→</span>
              <span className="ui-changelog__after">{display(c.after)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
