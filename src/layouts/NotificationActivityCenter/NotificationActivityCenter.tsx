import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { Tabs } from "../../components/Tabs";
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

  const filterFor = (id: NotificationCategory | "all") =>
    id === "all" ? notifications : notifications.filter((n) => n.category === id);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderList = (items: ActivityNotification[]) => (
    <ul className="ui-activity-center__list">
      {items.length === 0 && (
        <li className="ui-activity-center__empty">{emptyMessage}</li>
      )}
      {items.map((n) => (
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
              <Button
                variant="ghost"
                size="sm"
                className="ui-activity-center__read-toggle"
                onClick={() => onToggleRead(n.id, !n.read)}
                aria-pressed={!!n.read}
              >
                {n.read ? "Mark unread" : "Mark read"}
              </Button>
            )}
          </Box>
        </li>
      ))}
    </ul>
  );

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
          <Button
            variant="ghost"
            size="sm"
            className="ui-activity-center__mark-all"
            onClick={onMarkAllRead}
          >
            Mark all as read
          </Button>
        )}
      </Box>
      <Tabs
        value={active}
        onChange={(v) => setActive(v as NotificationCategory | "all")}
      >
        <Tabs.List
          aria-label="Notification categories"
          className="ui-activity-center__tabs"
        >
          <Tabs.Tab value="all" className="ui-activity-center__tab">
            All
          </Tabs.Tab>
          {categories.map((c) => (
            <Tabs.Tab key={c.id} value={c.id} className="ui-activity-center__tab">
              {c.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="all">{renderList(filterFor("all"))}</Tabs.Panel>
        {categories.map((c) => (
          <Tabs.Panel key={c.id} value={c.id}>
            {renderList(filterFor(c.id))}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
});
