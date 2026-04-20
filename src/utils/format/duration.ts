const NULL_DISPLAY = "\u2014";

export type DurationStyle = "human" | "compact" | "short" | "long";
export type DurationUnit = "ms" | "s" | "m" | "h" | "d";

export interface FormatDurationOptions {
  /** Display style: "human"/"short" → "2h 15m", "long" → "2 hours 15 minutes", "compact" → "2:15:00". Default: "human". */
  style?: DurationStyle;
  /** Maximum number of unit chunks to render. */
  precision?: number;
  /** Smallest unit to render. Sub-`smallest` values render as `< 1 {smallest}`. */
  smallest?: DurationUnit;
  /** Largest unit to render. Values that would otherwise overflow into a larger unit roll up here. */
  largest?: DurationUnit;
}

export interface DurationChunk {
  value: number;
  unit: DurationUnit;
  shortLabel: string;
  longLabel: string;
}

const UNIT_ORDER: DurationUnit[] = ["ms", "s", "m", "h", "d"];
const UNIT_MS: Record<DurationUnit, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};
const SHORT_LABEL: Record<DurationUnit, string> = {
  ms: "ms",
  s: "s",
  m: "m",
  h: "h",
  d: "d",
};
const LONG_LABEL_SINGULAR: Record<DurationUnit, string> = {
  ms: "millisecond",
  s: "second",
  m: "minute",
  h: "hour",
  d: "day",
};

function unitIndex(u: DurationUnit): number {
  return UNIT_ORDER.indexOf(u);
}

/**
 * Decompose a millisecond duration into ordered chunks honoring smallest/largest/precision.
 * Returns an empty array for null/invalid input.
 */
export function formatDurationChunks(
  ms: number | null | undefined,
  {
    smallest = "s",
    largest = "d",
    precision = 2,
  }: { smallest?: DurationUnit; largest?: DurationUnit; precision?: number } = {},
): DurationChunk[] {
  if (ms == null || Number.isNaN(ms) || ms < 0) return [];
  const smIdx = unitIndex(smallest);
  const lgIdx = unitIndex(largest);
  if (lgIdx < smIdx) return [];

  const units = UNIT_ORDER.slice(smIdx, lgIdx + 1).reverse();
  const chunks: DurationChunk[] = [];
  let remaining = ms;
  for (const unit of units) {
    const sizeMs = UNIT_MS[unit];
    const value =
      unit === smallest
        ? Math.floor(remaining / sizeMs)
        : Math.floor(remaining / sizeMs);
    if (value > 0 || (chunks.length === 0 && unit === smallest)) {
      chunks.push({
        value,
        unit,
        shortLabel: SHORT_LABEL[unit],
        longLabel:
          value === 1
            ? LONG_LABEL_SINGULAR[unit]
            : `${LONG_LABEL_SINGULAR[unit]}s`,
      });
      remaining -= value * sizeMs;
    }
    if (chunks.length >= precision) break;
  }
  return chunks;
}

export function formatDuration(
  ms: number | null | undefined,
  options: FormatDurationOptions = {},
): string {
  if (ms == null || Number.isNaN(ms) || ms < 0) return NULL_DISPLAY;

  const {
    style = "human",
    precision,
    smallest = "s",
    largest = "d",
  } = options;

  if (style === "compact") {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) {
      return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  const smIdx = unitIndex(smallest);
  const smallestMs = UNIT_MS[smallest];
  if (ms > 0 && ms < smallestMs && smIdx > 0) {
    return style === "long"
      ? `< 1 ${LONG_LABEL_SINGULAR[smallest]}`
      : `< 1${SHORT_LABEL[smallest]}`;
  }

  const chunks = formatDurationChunks(ms, {
    smallest,
    largest,
    precision: precision ?? (style === "human" ? 4 : 2),
  });
  if (chunks.length === 0) {
    return style === "long"
      ? `0 ${LONG_LABEL_SINGULAR[smallest]}s`
      : `0${SHORT_LABEL[smallest]}`;
  }

  if (style === "long") {
    return chunks.map((c) => `${c.value} ${c.longLabel}`).join(" ");
  }
  return chunks.map((c) => `${c.value}${c.shortLabel}`).join(" ");
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
