import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon } from "../../primitives/Icon";
import { formatNumber, formatPercent } from "../../utils";
import "./Delta.css";

export type DeltaDisplay = "absolute" | "percent" | "both";
export type DeltaPolarity = "positive-good" | "negative-good" | "neutral";

export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  current?: number | null;
  previous?: number | null;
  delta?: number | null;
  percent?: number | null;
  display?: DeltaDisplay;
  polarity?: DeltaPolarity;
  precision?: number;
  locale?: string;
}

const EM_DASH = "\u2014";

function computeDelta(
  current: number | null | undefined,
  previous: number | null | undefined,
  explicitDelta: number | null | undefined,
): number | null {
  if (explicitDelta != null && !Number.isNaN(explicitDelta)) return explicitDelta;
  if (current == null || previous == null) return null;
  if (Number.isNaN(current) || Number.isNaN(previous)) return null;
  return current - previous;
}

function computePercent(
  current: number | null | undefined,
  previous: number | null | undefined,
  explicitPercent: number | null | undefined,
): number | null {
  if (explicitPercent != null && !Number.isNaN(explicitPercent)) return explicitPercent;
  if (current == null || previous == null || previous === 0) return null;
  return (current - previous) / Math.abs(previous);
}

export const Delta = forwardRef<HTMLSpanElement, DeltaProps>(
  function Delta(
    {
      current,
      previous,
      delta,
      percent,
      display = "both",
      polarity = "positive-good",
      precision,
      locale,
      className,
      "aria-label": ariaLabelProp,
      ...rest
    },
    ref,
  ) {
    const rawDelta = computeDelta(current, previous, delta);
    const rawPercent = computePercent(current, previous, percent);

    const needAbsolute = display !== "percent";
    const needPercent = display !== "absolute";
    const missing =
      (needAbsolute && rawDelta == null) ||
      (needPercent && display === "percent" && rawPercent == null);

    if (missing) {
      return (
        <span
          ref={ref}
          className={["ui-delta", className].filter(Boolean).join(" ")}
          {...rest}
        >
          {EM_DASH}
        </span>
      );
    }

    const signSource = rawDelta ?? rawPercent ?? 0;
    const dir: "up" | "down" | "flat" =
      signSource === 0 ? "flat" : signSource > 0 ? "up" : "down";

    let tone: "success" | "error" | "secondary";
    if (polarity === "neutral" || dir === "flat") tone = "secondary";
    else if (polarity === "negative-good") tone = dir === "up" ? "error" : "success";
    else tone = dir === "up" ? "success" : "error";

    const iconName = dir === "up" ? "arrow-up" : dir === "down" ? "arrow-down" : "minus";

    const absText =
      rawDelta != null
        ? (() => {
            const n = formatNumber(Math.abs(rawDelta), { locale, decimals: precision });
            return rawDelta > 0 ? `+${n}` : rawDelta < 0 ? `\u2212${n}` : n;
          })()
        : null;

    const pctText =
      rawPercent != null
        ? formatPercent(rawPercent * 100, { locale, decimals: precision, sign: true })
        : null;

    const classes = ["ui-delta", `ui-delta--${dir}`, className].filter(Boolean).join(" ");

    const spoken =
      dir === "flat"
        ? "No change"
        : `${dir === "up" ? "Increased" : "Decreased"} by ${absText ?? pctText ?? ""}${pctText && absText ? `, ${pctText}` : ""}`;

    return (
      <span
        ref={ref}
        className={classes}
        aria-label={ariaLabelProp ?? spoken}
        {...rest}
      >
        <Box display="inline-flex" align="center" gap="0.5">
          <Icon name={iconName} size="xs" aria-hidden />
          {needAbsolute && absText && (
            <Text as="span" color={tone}>{absText}</Text>
          )}
          {needPercent && pctText && display === "both" && absText && (
            <Text as="span" color="secondary">({pctText})</Text>
          )}
          {needPercent && pctText && display === "percent" && (
            <Text as="span" color={tone}>{pctText}</Text>
          )}
        </Box>
      </span>
    );
  },
);
