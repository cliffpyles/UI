import { forwardRef, type HTMLAttributes } from "react";
import { formatBytes } from "../../utils";
import "./FileSize.css";

export interface FileSizeProps extends HTMLAttributes<HTMLSpanElement> {
  bytes: number | null | undefined;
  precision?: number;
}

export const FileSize = forwardRef<HTMLSpanElement, FileSizeProps>(
  function FileSize({ bytes, precision, className, ...rest }, ref) {
    const classes = ["ui-file-size", className].filter(Boolean).join(" ");
    return (
      <span ref={ref} className={classes} {...rest}>
        {formatBytes(bytes, { decimals: precision })}
      </span>
    );
  },
);
