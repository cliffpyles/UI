const NULL_DISPLAY = "\u2014";

export interface FormatCompactOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Number of decimal places (default: 1). */
  decimals?: number;
}

/**
 * Formats a number in compact notation (1.2K, 3.4M, 1.2B).
 *
 * Returns "—" for null, undefined, and NaN.
 */
export function formatCompact(
  value: number | null | undefined,
  options: FormatCompactOptions = {},
): string {
  if (value == null || Number.isNaN(value)) return NULL_DISPLAY;

  const { locale, decimals = 1 } = options;

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: decimals,
  }).format(value);
}
