import { forwardRef, type HTMLAttributes } from "react";
import { Avatar } from "../../components/Avatar";
import "./UserAvatar.css";

export type UserPresence = "online" | "away" | "busy" | "offline";
export type UserAvatarSize = "sm" | "md" | "lg" | "xl";

export interface UserData {
  id?: string;
  name: string;
  image?: string;
  status?: UserPresence;
}

export interface UserAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  user: UserData;
  size?: UserAvatarSize;
  showPresence?: boolean;
}

const PRESENCE_LABEL: Record<UserPresence, string> = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
};

export const UserAvatar = forwardRef<HTMLSpanElement, UserAvatarProps>(
  function UserAvatar({ user, size = "md", showPresence, className, ...rest }, ref) {
    const classes = ["ui-user-avatar", `ui-user-avatar--${size}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <Avatar src={user.image} alt={user.name} name={user.name} size={size} />
        {showPresence && user.status && (
          <span
            className={`ui-user-avatar__presence ui-user-avatar__presence--${user.status}`}
            role="img"
            aria-label={PRESENCE_LABEL[user.status]}
          />
        )}
      </span>
    );
  },
);
