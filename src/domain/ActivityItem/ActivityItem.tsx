import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { UserChip } from "../UserChip";
import { Timestamp } from "../Timestamp";
import type { UserData } from "../UserAvatar";
import "./ActivityItem.css";

export interface ActivityItemAction {
  label: string;
  onSelect: () => void;
}

export interface ActivityItemProps extends HTMLAttributes<HTMLElement> {
  actor: UserData;
  action: ReactNode;
  target?: ReactNode;
  occurredAt: Date | string | number;
  actions?: ActivityItemAction[];
}

function plainText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join(" ");
  if (typeof node === "object" && "props" in node) {
    return plainText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export const ActivityItem = forwardRef<HTMLElement, ActivityItemProps>(
  function ActivityItem(
    { actor, action, target, occurredAt, actions, className, ...rest },
    ref,
  ) {
    const classes = ["ui-activity-item", className].filter(Boolean).join(" ");
    const label = [actor.name, plainText(action), plainText(target)]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        as="article"
        ref={ref as React.Ref<HTMLElement>}
        aria-label={label}
        direction="row"
        align="start"
        gap="3"
        className={classes}
        {...rest}
      >
        <UserChip user={actor} size="sm" />
        <Box
          direction="column"
          gap="1"
          grow
          minWidth={0}
          className="ui-activity-item__body"
        >
          <Text as="span" size="sm" color="secondary">
            {action}
            {target ? " " : null}
            {target}
          </Text>
          <Timestamp
            date={occurredAt}
            format="auto"
            className="ui-activity-item__time"
          />
        </Box>
        {actions && actions.length > 0 && (
          <Box
            direction="row"
            gap="1"
            align="center"
            className="ui-activity-item__actions"
          >
            {actions.map((a) => (
              <Button
                key={a.label}
                variant="ghost"
                size="sm"
                onClick={a.onSelect}
              >
                {a.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    );
  },
);

ActivityItem.displayName = "ActivityItem";
