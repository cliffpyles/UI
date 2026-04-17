import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { UserAvatar } from "../UserAvatar";
import { DueDateIndicator } from "../DueDateIndicator";
import { StatusBadge, type StatusMap } from "../StatusBadge";
import type { UserData } from "../UserAvatar";
import "./TaskCard.css";

export interface TaskData {
  id: string;
  title: string;
  description?: ReactNode;
  assignee?: UserData;
  dueDate?: Date | string | number | null;
  status?: string;
  priority?: string;
  labels?: { id: string; name: string; color?: string }[];
}

export interface TaskCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  task: TaskData;
  onActivate?: (id: string) => void;
  statusMap?: StatusMap;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard({ task, onActivate, statusMap, className, ...rest }, ref) {
    const classes = ["ui-task-card", className].filter(Boolean).join(" ");

    const interactive = !!onActivate;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="2"
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={interactive ? () => onActivate(task.id) : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onActivate(task.id);
                }
              }
            : undefined
        }
        {...rest}
      >
        <Box
          className="ui-task-card__header"
          display="flex"
          align="start"
          justify="between"
          gap="2"
        >
          <Text as="h4" size="sm" weight="semibold" color="primary" className="ui-task-card__title">
            {task.title}
          </Text>
          {task.status && <StatusBadge status={task.status} statusMap={statusMap} size="sm" />}
        </Box>
        {task.description && (
          <div className="ui-task-card__description">{task.description}</div>
        )}
        {task.labels && task.labels.length > 0 && (
          <Box className="ui-task-card__labels" display="flex" wrap gap="1">
            {task.labels.map((l) => (
              <span
                key={l.id}
                className="ui-task-card__label"
                style={l.color ? { background: l.color, color: "white" } : undefined}
              >
                {l.name}
              </span>
            ))}
          </Box>
        )}
        <Box
          className="ui-task-card__footer"
          display="flex"
          align="center"
          gap="2"
        >
          {task.assignee && <UserAvatar user={task.assignee} size="sm" />}
          {task.dueDate && <DueDateIndicator date={task.dueDate} />}
          {task.priority && <span className="ui-task-card__priority">{task.priority}</span>}
        </Box>
      </Box>
    );
  },
);
