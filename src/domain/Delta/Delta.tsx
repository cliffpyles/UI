import { forwardRef, type HTMLAttributes } from "react";
import { formatNumber, formatPercent } from "../../utils";
import "./Delta.css";

export type DeltaFormat = "absolute" | "percent";

export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  current: number | null | undefined;
  previous: number | null | undefined;
  format?: DeltaFormat;
  invert?: boolean;
  precision?: number;
  locale?: string;
}

const NULL = "\u2014";

export const Delta = forwardRef<HTMLSpanElement, DeltaProps>(
  function Delta(
    { current, previous, format = "absolute", invert = false, precision, locale, className, ...rest },
    ref,
  ) {
    if (
      current == null || previous == null ||
      Number.isNaN(current) || Number.isNaN(previous)
    ) {
      return (
        <span ref={ref} className={["ui-delta", className].filter(Boolean).join(" ")} {...rest}>
          {NULL}
        </span>
      );
    }

    let diff: number;
    let display: string;
    if (format === "percent") {
      if (previous === 0) {
        return (
          <span ref={ref} className={["ui-delta", className].filter(Boolean).join(" ")} {...rest}>
            {NULL}
          </span>
        );
      }
      diff = ((current - previous) / Math.abs(previous)) * 100;
      display = formatPercent(diff, { locale, decimals: precision, sign: true });
    } else {
      diff = current - previous;
      const abs = formatNumber(Math.abs(diff), { locale, decimals: precision });
      display = diff > 0 ? `+${abs}` : diff < 0 ? `\u2212${abs}` : abs;
    }

    const dir = diff === 0 ? "flat" : diff > 0 ? "up" : "down";
    const tone = dir === "flat" ? "flat" : invert ? (dir === "up" ? "down" : "up") : dir;

    const classes = ["ui-delta", `ui-delta--${tone}`, className].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {display}
      </span>
    );
  },
);
