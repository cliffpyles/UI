import { forwardRef, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { formatDurationChunks, type DurationUnit } from "../../utils";
import "./Duration.css";

export type DurationFormat = "short" | "long";

export interface DurationProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  value: number | null | undefined;
  format?: DurationFormat;
  precision?: 1 | 2 | 3;
  smallest?: DurationUnit;
  largest?: Exclude<DurationUnit, "ms">;
}

const EM_DASH = "\u2014";
const UNIT_LONG_SINGULAR: Record<DurationUnit, string> = {
  ms: "millisecond",
  s: "second",
  m: "minute",
  h: "hour",
  d: "day",
};
const UNIT_SHORT: Record<DurationUnit, string> = {
  ms: "ms",
  s: "s",
  m: "m",
  h: "h",
  d: "d",
};
const UNIT_MS: Record<DurationUnit, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export const Duration = forwardRef<HTMLSpanElement, DurationProps>(
  function Duration(
    {
      value,
      format = "short",
      precision = 2,
      smallest = "s",
      largest = "d",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-duration", className].filter(Boolean).join(" ");

    if (value == null || Number.isNaN(value) || value < 0) {
      return (
        <span ref={ref} className={classes} {...rest}>
          <Text as="span" color="inherit">
            {EM_DASH}
          </Text>
        </span>
      );
    }

    const smallestMs = UNIT_MS[smallest];
    const isSubUnit = value > 0 && value < smallestMs;
    const chunks = formatDurationChunks(value, {
      smallest,
      largest,
      precision,
    });

    let visualChunks: { value: number; unit: DurationUnit }[];
    if (isSubUnit) {
      visualChunks = [];
    } else if (chunks.length === 0) {
      visualChunks = [{ value: 0, unit: smallest }];
    } else {
      visualChunks = chunks.map((c) => ({ value: c.value, unit: c.unit }));
    }

    const longLabel = isSubUnit
      ? `Less than 1 ${UNIT_LONG_SINGULAR[smallest]}`
      : visualChunks
          .map(
            (c) =>
              `${c.value} ${UNIT_LONG_SINGULAR[c.unit]}${c.value === 1 ? "" : "s"}`,
          )
          .join(" ");

    if (isSubUnit) {
      return (
        <span ref={ref} className={classes} aria-label={longLabel} {...rest}>
          <Box display="inline-flex" align="center" gap="0.5">
            <Text as="span" color="inherit">
              {format === "long"
                ? `Less than 1 ${UNIT_LONG_SINGULAR[smallest]}`
                : `< 1${UNIT_SHORT[smallest]}`}
            </Text>
          </Box>
        </span>
      );
    }

    return (
      <span ref={ref} className={classes} aria-label={longLabel} {...rest}>
        <Box display="inline-flex" align="center" gap="0.5">
          {visualChunks.map((c, i) => {
            if (format === "long") {
              return (
                <span
                  key={i}
                  className="ui-duration__chunk ui-duration__chunk--long"
                >
                  <Text as="span" color="inherit">
                    {c.value}{" "}
                    {UNIT_LONG_SINGULAR[c.unit]}
                    {c.value === 1 ? "" : "s"}
                  </Text>
                </span>
              );
            }
            return (
              <span key={i} className="ui-duration__chunk">
                <Text as="span" color="inherit">
                  {c.value}
                </Text>
                <Text as="span" color="secondary">
                  {UNIT_SHORT[c.unit]}
                </Text>
              </span>
            );
          })}
        </Box>
      </span>
    );
  },
);
