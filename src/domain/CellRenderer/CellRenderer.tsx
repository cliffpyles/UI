import { forwardRef, type HTMLAttributes } from "react";
import { Currency } from "../Currency";
import { Percentage } from "../Percentage";
import { Timestamp } from "../Timestamp";
import { FileSize } from "../FileSize";
import { Duration } from "../Duration";
import { StatusBadge } from "../StatusBadge";
import { UserChip } from "../UserChip";
import type { UserData } from "../UserAvatar";
import "./CellRenderer.css";

export type CellType =
  | "text"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "bytes"
  | "duration"
  | "status"
  | "user"
  | "boolean";

export interface CellRendererProps extends HTMLAttributes<HTMLSpanElement> {
  type: CellType;
  value: unknown;
  options?: Record<string, unknown>;
}

const NULL_DISPLAY = "\u2014";

export const CellRenderer = forwardRef<HTMLSpanElement, CellRendererProps>(
  function CellRenderer({ type, value, options = {}, className, ...rest }, ref) {
    const classes = ["ui-cell", `ui-cell--${type}`, className].filter(Boolean).join(" ");

    if (value == null) {
      return (
        <span ref={ref} className={classes} {...rest}>
          {NULL_DISPLAY}
        </span>
      );
    }

    let content: React.ReactNode;
    switch (type) {
      case "currency":
        content = (
          <Currency
            value={value as number}
            currency={(options.currency as string) ?? "USD"}
          />
        );
        break;
      case "percent":
        content = <Percentage value={value as number} />;
        break;
      case "date":
        content = <Timestamp date={value as string | number | Date} />;
        break;
      case "bytes":
        content = <FileSize bytes={value as number} />;
        break;
      case "duration":
        content = <Duration value={value as number} />;
        break;
      case "status":
        content = (
          <StatusBadge
            status={String(value)}
            statusMap={options.statusMap as never}
          />
        );
        break;
      case "user":
        content = <UserChip user={value as UserData} />;
        break;
      case "boolean":
        content = value ? "Yes" : "No";
        break;
      case "number":
        content = (value as number).toLocaleString();
        break;
      case "text":
      default:
        content = String(value);
        break;
    }

    return (
      <span ref={ref} className={classes} {...rest}>
        {content}
      </span>
    );
  },
);
