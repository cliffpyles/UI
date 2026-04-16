const NULL_DISPLAY = "\u2014";

export type DateFormatStyle = "relative" | "short" | "full";

export interface FormatDateOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Format style. "relative" (default) uses relative time when recent. */
  format?: DateFormatStyle;
  /** Reference date for relative calculations. Defaults to now. */
  now?: Date;
}

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

/**
 * Formats a date with relative time when recent and absolute when older,
 * following the design system's date display strategy.
 *
 * Returns "—" for null, undefined, and invalid dates.
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  options: FormatDateOptions = {},
): string {
  if (value == null) return NULL_DISPLAY;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return NULL_DISPLAY;

  const { locale, format = "relative", now = new Date() } = options;

  if (format === "full") {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  if (format === "short") {
    return formatAbsolute(date, now, locale);
  }

  // Relative mode: use relative time when recent
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    // Future dates: show absolute
    return formatAbsolute(date, now, locale);
  }

  if (diffMs < MINUTE) {
    return "Just now";
  }

  if (diffMs < HOUR) {
    const minutes = Math.floor(diffMs / MINUTE);
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(
      -minutes,
      "minute",
    );
  }

  if (diffMs < DAY) {
    const hours = Math.floor(diffMs / HOUR);
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(
      -hours,
      "hour",
    );
  }

  if (diffMs < 7 * DAY) {
    const days = Math.floor(diffMs / DAY);
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(
      -days,
      "day",
    );
  }

  return formatAbsolute(date, now, locale);
}

function formatAbsolute(date: Date, now: Date, locale?: string): string {
  const sameYear = date.getFullYear() === now.getFullYear();

  if (sameYear) {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
