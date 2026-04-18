import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
import { UserAvatar, type UserData } from "../UserAvatar";
import "./UserChip.css";

export type UserChipSize = "sm" | "md";

export interface UserChipProps extends HTMLAttributes<HTMLSpanElement> {
  user: UserData;
  size?: UserChipSize;
  removable?: boolean;
  onRemove?: () => void;
  showPresence?: boolean;
}

export const UserChip = forwardRef<HTMLSpanElement, UserChipProps>(
  function UserChip(
    { user, size = "md", removable, onRemove, showPresence, className, ...rest },
    ref,
  ) {
    const classes = ["ui-user-chip", `ui-user-chip--${size}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <UserAvatar user={user} size="sm" showPresence={showPresence} />
        <Text as="span" size="sm" className="ui-user-chip__name">{user.name}</Text>
        {removable && (
          <Button
            variant="ghost"
            size="sm"
            className="ui-user-chip__remove"
            onClick={onRemove}
            aria-label={`Remove ${user.name}`}
          >
            <Icon name="x" size="xs" aria-hidden />
          </Button>
        )}
      </span>
    );
  },
);
