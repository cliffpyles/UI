const NULL_DISPLAY = "\u2014";

export interface FormatBytesOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Number of decimal places (default: 1). */
  decimals?: number;
}

const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

/**
 * Formats a byte count to a human-readable string (KB, MB, GB, etc.).
 *
 * Returns "—" for null, undefined, NaN, and negative values.
 */
export function formatBytes(
  bytes: number | null | undefined,
  options: FormatBytesOptions = {},
): string {
  if (bytes == null || Number.isNaN(bytes) || bytes < 0) return NULL_DISPLAY;

  const { locale, decimals = 1 } = options;

  if (bytes === 0) return "0 B";

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  const unit = UNITS[exponent];

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: exponent === 0 ? 0 : decimals,
    maximumFractionDigits: exponent === 0 ? 0 : decimals,
  }).format(value);

  return `${formatted} ${unit}`;
}
