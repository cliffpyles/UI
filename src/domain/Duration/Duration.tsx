import { forwardRef, type HTMLAttributes } from "react";
import { formatDuration, type DurationStyle } from "../../utils";
import "./Duration.css";

export interface DurationProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  format?: DurationStyle;
}

export const Duration = forwardRef<HTMLSpanElement, DurationProps>(
  function Duration({ value, format = "human", className, ...rest }, ref) {
    const classes = ["ui-duration", className].filter(Boolean).join(" ");
    return (
      <span ref={ref} className={classes} {...rest}>
        {formatDuration(value, { style: format })}
      </span>
    );
  },
);
