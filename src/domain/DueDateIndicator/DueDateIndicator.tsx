import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon, type IconName } from "../../primitives/Icon";
import { Tooltip } from "../../components/Tooltip";
import { formatDate, type DateFormatStyle } from "../../utils";
import "./DueDateIndicator.css";

export type DueStatus = "ontime" | "due-soon" | "overdue" | "complete";
export type DueDateFormat = "relative" | "short" | "medium";

export interface DueDateIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  date: Date | string | number | null | undefined;
  status?: DueStatus;
  format?: DueDateFormat;
  completed?: boolean;
  locale?: string;
  now?: Date;
}

const EM_DASH = "\u2014";
const SOON_DAYS = 3;

const STATUS_ICON: Record<DueStatus, IconName> = {
  ontime: "calendar",
  "due-soon": "clock",
  overdue: "alert-triangle",
  complete: "check",
};

const STATUS_TEXT_TONE: Record<
  DueStatus,
  "primary" | "warning" | "error" | "secondary"
> = {
  ontime: "primary",
  "due-soon": "warning",
  overdue: "error",
  complete: "secondary",
};

function deriveStatus(date: Date, now: Date): DueStatus {
  const diff = date.getTime() - now.getTime();
  const days = diff / 86_400_000;
  if (diff < 0) return "overdue";
  if (days <= SOON_DAYS) return "due-soon";
  return "ontime";
}

function toFormatStyle(f: DueDateFormat): DateFormatStyle {
  if (f === "medium") return "full";
  return f;
}

function toAbsoluteString(date: Date, locale: string | undefined): string {
  return formatDate(date, { locale, format: "full" });
}

export const DueDateIndicator = forwardRef<
  HTMLSpanElement,
  DueDateIndicatorProps
>(function DueDateIndicator(
  {
    date,
    status: statusProp,
    format = "short",
    completed = false,
    locale,
    now,
    className,
    ...rest
  },
  ref,
) {
  if (date == null) {
    return (
      <Tooltip content="No due date">
        <span
          ref={ref}
          className={["ui-due-date-indicator", "ui-due-date-indicator--empty", className]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        >
          <Box display="inline-flex" align="center" gap="1">
            <Text size="sm" color="tertiary">
              {EM_DASH}
            </Text>
          </Box>
        </span>
      </Tooltip>
    );
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return (
      <Tooltip content="Invalid date">
        <span
          ref={ref}
          className={["ui-due-date-indicator", className]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        >
          <Box display="inline-flex" align="center" gap="1">
            <Text size="sm" color="tertiary">
              {EM_DASH}
            </Text>
          </Box>
        </span>
      </Tooltip>
    );
  }

  const reference = now ?? new Date();
  const resolved: DueStatus = completed
    ? "complete"
    : (statusProp ?? deriveStatus(dateObj, reference));

  const display = formatDate(dateObj, {
    locale,
    format: toFormatStyle(format),
    now: reference,
  });
  const absolute = toAbsoluteString(dateObj, locale);
  const iso = dateObj.toISOString();

  const classes = [
    "ui-due-date-indicator",
    `ui-due-date-indicator--${resolved}`,
    completed && "ui-due-date-indicator--completed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tooltip content={absolute}>
      <span ref={ref} className={classes} {...rest}>
        <Box display="inline-flex" align="center" gap="1">
          <Icon
            name={STATUS_ICON[resolved]}
            size="sm"
            aria-hidden
            className={`ui-due-date-indicator__icon ui-due-date-indicator__icon--${resolved}`}
          />
          <Text
            as="span"
            size="sm"
            color={STATUS_TEXT_TONE[resolved]}
            className="ui-due-date-indicator__text"
          >
            <time dateTime={iso}>{display}</time>
          </Text>
        </Box>
      </span>
    </Tooltip>
  );
});
