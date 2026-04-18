import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Currency } from "../Currency";
import { Percentage } from "../Percentage";
import { Timestamp } from "../Timestamp";
import { FileSize } from "../FileSize";
import { Duration } from "../Duration";
import { StatusBadge } from "../StatusBadge";
import { UserChip } from "../UserChip";
import { TrendIndicator, type TrendDirection } from "../TrendIndicator";
import { Sparkline } from "../Sparkline";
import { Tag } from "../../components/Tag";
import { formatNumber } from "../../utils";
import type { UserData } from "../UserAvatar";
import "./CellRenderer.css";

export type CellType =
  | "text"
  | "number"
  | "currency"
  | "percent"
  | "timestamp"
  | "date"
  | "bytes"
  | "duration"
  | "status"
  | "user"
  | "trend"
  | "sparkline"
  | "tag"
  | "tags"
  | "boolean";

export interface CellRendererProps extends HTMLAttributes<HTMLSpanElement> {
  type: CellType;
  value: unknown;
  options?: Record<string, unknown>;
  align?: "start" | "end";
}

const NULL_DISPLAY = "\u2014";

function renderByType(
  type: CellType,
  value: unknown,
  options: Record<string, unknown>,
): ReactNode {
  switch (type) {
    case "currency":
      return (
        <Currency
          value={value as number}
          currency={(options.currency as string) ?? "USD"}
        />
      );
    case "percent":
      return <Percentage value={value as number} />;
    case "timestamp":
    case "date":
      return <Timestamp date={value as string | number | Date} />;
    case "bytes":
      return <FileSize bytes={value as number} />;
    case "duration":
      return <Duration value={value as number} />;
    case "status":
      return (
        <StatusBadge
          status={String(value)}
          statusMap={options.statusMap as never}
        />
      );
    case "user":
      return <UserChip user={value as UserData} />;
    case "trend":
      return (
        <TrendIndicator
          direction={value as TrendDirection}
          value={options.delta as number | undefined}
        />
      );
    case "sparkline":
      return <Sparkline data={value as number[]} />;
    case "tag":
      return <Tag>{String(value)}</Tag>;
    case "tags":
      return (
        <Box direction="row" gap="1" wrap>
          {(value as string[]).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Box>
      );
    case "boolean":
      return (
        <Text as="span" size="sm">
          {value ? "Yes" : "No"}
        </Text>
      );
    case "number":
      return (
        <Text as="span" size="sm">
          {formatNumber(value as number)}
        </Text>
      );
    case "text":
    default:
      return (
        <Text as="span" size="sm">
          {String(value)}
        </Text>
      );
  }
}

export const CellRenderer = forwardRef<HTMLSpanElement, CellRendererProps>(
  function CellRenderer(
    { type, value, options = {}, align, className, ...rest },
    ref,
  ) {
    const classes = [
      "ui-cell",
      `ui-cell--${type}`,
      align === "end" && "ui-cell--end",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (value == null) {
      return (
        <span
          ref={ref}
          className={classes}
          aria-label="No value"
          {...rest}
        >
          {NULL_DISPLAY}
        </span>
      );
    }

    const content = renderByType(type, value, options);

    // Wrap in Box for alignment hints (per spec: "Box when wrapping is needed for alignment")
    if (align === "end") {
      return (
        <span ref={ref} className={classes} {...rest}>
          <Box direction="row" justify="end">
            {content}
          </Box>
        </span>
      );
    }

    return (
      <span ref={ref} className={classes} {...rest}>
        {content}
      </span>
    );
  },
);

CellRenderer.displayName = "CellRenderer";
