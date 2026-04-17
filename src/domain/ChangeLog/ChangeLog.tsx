import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
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
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="2"
        {...rest}
      >
        {(title || actor || timestamp) && (
          <Box
            className="ui-changelog__header"
            display="flex"
            align="center"
            gap="2"
          >
            {actor && <UserChip user={actor} size="sm" />}
            {title && (
              <Text as="span" weight="medium" color="primary">
                {title}
              </Text>
            )}
            {timestamp && (
              <Timestamp
                date={timestamp}
                format="auto"
                className="ui-changelog__time"
              />
            )}
          </Box>
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
      </Box>
    );
  },
);
