import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./NotificationActivityCenter.css";

export type NotificationCategory = string;

export interface ActivityNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
  actions?: ReactNode;
}

export interface NotificationCategoryDef {
  id: NotificationCategory;
  label: string;
}

export interface NotificationActivityCenterProps extends HTMLAttributes<HTMLDivElement> {
  notifications: ActivityNotification[];
  categories: NotificationCategoryDef[];
  activeCategoryId?: NotificationCategory | "all";
  onCategoryChange?: (id: NotificationCategory | "all") => void;
  onToggleRead?: (id: string, read: boolean) => void;
  onMarkAllRead?: () => void;
  emptyMessage?: string;
  heading?: string;
}

export const NotificationActivityCenter = forwardRef<
  HTMLDivElement,
  NotificationActivityCenterProps
>(function NotificationActivityCenter(
  {
    notifications,
    categories,
    activeCategoryId,
    onCategoryChange,
    onToggleRead,
    onMarkAllRead,
    emptyMessage = "You're all caught up",
    heading = "Activity",
    className,
    ...rest
  },
  ref,
) {
  const [internalActive, setInternalActive] = useState<NotificationCategory | "all">("all");
  const active = activeCategoryId ?? internalActive;

  const filtered = useMemo(
    () => (active === "all" ? notifications : notifications.filter((n) => n.category === active)),
    [active, notifications],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const setActive = (id: NotificationCategory | "all") => {
    if (activeCategoryId === undefined) setInternalActive(id);
    onCategoryChange?.(id);
  };

  const classes = ["ui-activity-center", className].filter(Boolean).join(" ");

  return (
    <Box ref={ref as Ref<HTMLElement>} direction="column" className={classes} {...rest}>
      <Box
        align="center"
        justify="between"
        gap="3"
        className="ui-activity-center__header"
      >
        <Text as="h2" size="base" weight="semibold" className="ui-activity-center__heading">
          {heading}
          {unreadCount > 0 && (
            <span className="ui-activity-center__count" aria-label={`${unreadCount} unread`}>
              {unreadCount}
            </span>
          )}
        </Text>
        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            className="ui-activity-center__mark-all"
            onClick={onMarkAllRead}
          >
            Mark all as read
          </button>
        )}
      </Box>
      <Box gap="1" role="tablist" aria-label="Notification categories" className="ui-activity-center__tabs">
        <button
          type="button"
          role="tab"
          aria-selected={active === "all"}
          className={[
            "ui-activity-center__tab",
            active === "all" && "ui-activity-center__tab--active",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setActive("all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={[
              "ui-activity-center__tab",
              active === c.id && "ui-activity-center__tab--active",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </button>
        ))}
      </Box>
      <ul className="ui-activity-center__list">
        {filtered.length === 0 && (
          <li className="ui-activity-center__empty">{emptyMessage}</li>
        )}
        {filtered.map((n) => (
          <li
            key={n.id}
            className={[
              "ui-activity-center__item",
              !n.read && "ui-activity-center__item--unread",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Box
              direction="column"
              gap="1"
              grow
              minWidth={0}
              className="ui-activity-center__item-body"
            >
              <div className="ui-activity-center__item-title">
                {!n.read && (
                  <span
                    className="ui-activity-center__item-dot"
                    role="presentation"
                    aria-hidden="true"
                  />
                )}
                {n.title}
              </div>
              {n.description && (
                <div className="ui-activity-center__item-desc">{n.description}</div>
              )}
              {n.timestamp && (
                <div className="ui-activity-center__item-time">{n.timestamp}</div>
              )}
            </Box>
            <Box
              align="center"
              gap="2"
              shrink={false}
              className="ui-activity-center__item-actions"
            >
              {n.actions}
              {onToggleRead && (
                <button
                  type="button"
                  className="ui-activity-center__read-toggle"
                  onClick={() => onToggleRead(n.id, !n.read)}
                  aria-pressed={!!n.read}
                >
                  {n.read ? "Mark unread" : "Mark read"}
                </button>
              )}
            </Box>
          </li>
        ))}
      </ul>
    </Box>
  );
});
