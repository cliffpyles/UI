import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Spinner } from "../../primitives/Spinner";
import { Text } from "../../primitives/Text";
import { ActivityItem, type ActivityItemProps } from "../ActivityItem";
import "./ActivityFeed.css";

export interface ActivityFeedItem extends Omit<ActivityItemProps, "children"> {
  id: string;
}

export interface ActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  items: ActivityFeedItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  groupBy?: "day" | "week" | "none";
  emptyMessage?: string;
}

function groupKey(date: Date | string | number, by: "day" | "week"): string {
  const d = new Date(date);
  if (by === "day") {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(d);
  }
  // week
  const startOfWeek = new Date(d);
  startOfWeek.setDate(d.getDate() - d.getDay());
  return `Week of ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(startOfWeek)}`;
}

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(
  function ActivityFeed(
    {
      items,
      loading,
      onLoadMore,
      hasMore,
      groupBy = "none",
      emptyMessage = "No activity yet",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-activity-feed", className].filter(Boolean).join(" ");

    const groups = new Map<string, ActivityFeedItem[]>();
    if (groupBy === "none") {
      groups.set("", items);
    } else {
      for (const item of items) {
        const key = groupKey(item.timestamp, groupBy);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(item);
      }
    }

    return (
      <div ref={ref} className={classes} {...rest}>
        {items.length === 0 && !loading ? (
          <div className="ui-activity-feed__empty">{emptyMessage}</div>
        ) : (
          Array.from(groups.entries()).map(([key, groupItems]) => (
            <section key={key || "__all"} className="ui-activity-feed__group">
              {key && (
                <Text as="h3" size="xs" weight="semibold" color="tertiary" className="ui-activity-feed__group-label">
                  {key}
                </Text>
              )}
              {groupItems.map((item) => (
                <ActivityItem
                  key={item.id}
                  actor={item.actor}
                  action={item.action}
                  target={item.target}
                  timestamp={item.timestamp}
                  detail={item.detail}
                />
              ))}
            </section>
          ))
        )}
        {loading && (
          <div className="ui-activity-feed__loading">
            <Spinner size="sm" /> Loading activity…
          </div>
        )}
        {hasMore && onLoadMore && !loading && (
          <Button variant="secondary" size="sm" onClick={onLoadMore}>
            Load more
          </Button>
        )}
      </div>
    );
  },
);
