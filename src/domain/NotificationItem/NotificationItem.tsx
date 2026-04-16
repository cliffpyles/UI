import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "../../primitives/Icon";
import { Avatar } from "../../components/Avatar";
import { Timestamp } from "../Timestamp";
import "./NotificationItem.css";

export interface NotificationData {
  id: string;
  title: string;
  body?: ReactNode;
  timestamp: Date | string | number;
  read?: boolean;
  icon?: IconName;
  actor?: { name: string; image?: string };
  href?: string;
}

export interface NotificationItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "onSelect"> {
  notification: NotificationData;
  onRead?: (id: string) => void;
  onActivate?: (id: string) => void;
}

export const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  function NotificationItem(
    { notification, onRead, onActivate, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-notification-item",
      !notification.read && "ui-notification-item--unread",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleActivate = () => {
      if (!notification.read) onRead?.(notification.id);
      onActivate?.(notification.id);
    };

    return (
      <div
        ref={ref}
        className={classes}
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
          }
        }}
        {...rest}
      >
        <div className="ui-notification-item__visual" aria-hidden="true">
          {notification.actor ? (
            <Avatar
              name={notification.actor.name}
              src={notification.actor.image}
              alt={notification.actor.name}
              size="sm"
            />
          ) : notification.icon ? (
            <Icon name={notification.icon} size="md" />
          ) : (
            <Icon name="info" size="md" />
          )}
        </div>
        <div className="ui-notification-item__body">
          <div className="ui-notification-item__title">{notification.title}</div>
          {notification.body && (
            <div className="ui-notification-item__content">{notification.body}</div>
          )}
          <Timestamp
            date={notification.timestamp}
            format="auto"
            className="ui-notification-item__time"
          />
        </div>
        {!notification.read && (
          <span className="ui-notification-item__dot" aria-label="Unread" />
        )}
      </div>
    );
  },
);
