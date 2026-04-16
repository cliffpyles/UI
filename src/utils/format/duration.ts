const NULL_DISPLAY = "\u2014";

export type DurationStyle = "human" | "compact";

export interface FormatDurationOptions {
  /** Display style: "human" (2h 15m) or "compact" (2:15:00). Default: "human". */
  style?: DurationStyle;
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 *
 * Returns "—" for null, undefined, NaN, and negative values.
 */
export function formatDuration(
  ms: number | null | undefined,
  options: FormatDurationOptions = {},
): string {
  if (ms == null || Number.isNaN(ms) || ms < 0) return NULL_DISPLAY;

  const { style = "human" } = options;

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (style === "compact") {
    if (days > 0) {
      return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  // Human-readable style
  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  // Show seconds only if total duration is under 1 hour and no larger units,
  // or if the total duration is 0
  if (parts.length === 0) {
    return seconds > 0 ? `${seconds}s` : "0s";
  }

  return parts.join(" ");
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
