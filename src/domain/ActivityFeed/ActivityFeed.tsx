import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { ActivityItem, type ActivityItemProps } from "../ActivityItem";
import "./ActivityFeed.css";

export interface ActivityEvent
  extends Omit<ActivityItemProps, "timestamp" | "children"> {
  id: string;
  occurredAt: Date | string | number;
}

export interface ActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  events: ActivityEvent[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  /** When provided, renders a "Load more" Button instead of Pagination. */
  loadMore?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

function dayKey(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
}

function dayHeading(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const todayKey = dayKey(today);
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const yestKey = dayKey(yest);

  if (iso === todayKey) return "Today";
  if (iso === yestKey) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(
  function ActivityFeed(
    {
      events,
      loading = false,
      page,
      pageSize,
      totalCount,
      onPageChange,
      loadMore,
      emptyTitle = "No activity yet",
      emptyDescription,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-activity-feed", className].filter(Boolean).join(" ");

    const groups = new Map<string, ActivityEvent[]>();
    for (const ev of events) {
      const key = dayKey(new Date(ev.occurredAt));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(ev);
    }

    const isEmpty = events.length === 0 && !loading;
    const totalPages =
      totalCount !== undefined && pageSize
        ? Math.max(1, Math.ceil(totalCount / pageSize))
        : undefined;
    const showPagination =
      page !== undefined &&
      totalPages !== undefined &&
      onPageChange !== undefined &&
      !loadMore;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        aria-label="Activity"
        direction="column"
        gap="4"
        className={classes}
        {...rest}
      >
        {isEmpty ? (
          <EmptyState
            variant="no-data"
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          Array.from(groups.entries()).map(([key, groupEvents]) => {
            const headingId = `ui-activity-feed-h-${key}`;
            return (
              <Box
                key={key}
                direction="column"
                gap="2"
                className="ui-activity-feed__group"
              >
                <Text
                  id={headingId}
                  as="h3"
                  size="sm"
                  weight="semibold"
                  color="secondary"
                  className="ui-activity-feed__group-heading"
                >
                  {dayHeading(key)}
                </Text>
                <Box
                  role="feed"
                  aria-busy={loading || undefined}
                  aria-labelledby={headingId}
                  direction="column"
                  gap="2"
                >
                  {groupEvents.map(({ id, occurredAt, ...itemProps }) => (
                    <ActivityItem
                      key={id}
                      role="article"
                      timestamp={occurredAt}
                      {...itemProps}
                    />
                  ))}
                </Box>
              </Box>
            );
          })
        )}

        {loading && (
          <Box direction="column" gap="2" className="ui-activity-feed__loading">
            <Skeleton height="2.5rem" />
            <Skeleton height="2.5rem" />
            <Skeleton height="2.5rem" />
          </Box>
        )}

        {loadMore && !loading && (
          <Button variant="ghost" size="sm" onClick={loadMore}>
            Load more
          </Button>
        )}

        {showPagination && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
      </Box>
    );
  },
);

ActivityFeed.displayName = "ActivityFeed";
