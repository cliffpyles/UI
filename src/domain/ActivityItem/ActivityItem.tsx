import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { UserAvatar } from "../UserAvatar";
import { Timestamp } from "../Timestamp";
import { Icon } from "../../primitives/Icon";
import type { UserData } from "../UserAvatar";
import "./ActivityItem.css";

export interface ActivityItemProps extends HTMLAttributes<HTMLDivElement> {
  actor: UserData;
  action: ReactNode;
  target?: ReactNode;
  timestamp: Date | string | number;
  detail?: ReactNode;
}

export const ActivityItem = forwardRef<HTMLDivElement, ActivityItemProps>(
  function ActivityItem(
    { actor, action, target, timestamp, detail, className, ...rest },
    ref,
  ) {
    const [expanded, setExpanded] = useState(false);
    const classes = ["ui-activity-item", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <UserAvatar user={actor} size="sm" />
        <div className="ui-activity-item__body">
          <div className="ui-activity-item__summary">
            <span className="ui-activity-item__actor">{actor.name}</span>{" "}
            <span className="ui-activity-item__action">{action}</span>
            {target && (
              <>
                {" "}
                <span className="ui-activity-item__target">{target}</span>
              </>
            )}
          </div>
          <Timestamp
            date={timestamp}
            format="auto"
            className="ui-activity-item__time"
          />
          {detail && (
            <>
              <button
                type="button"
                className="ui-activity-item__toggle"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                <Icon
                  name={expanded ? "chevron-down" : "chevron-right"}
                  size="xs"
                  aria-hidden
                />
                {expanded ? "Hide details" : "Show details"}
              </button>
              {expanded && <div className="ui-activity-item__detail">{detail}</div>}
            </>
          )}
        </div>
      </div>
    );
  },
);
