const NULL_DISPLAY = "\u2014";

export interface FormatPercentOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Number of decimal places (default: 1). */
  decimals?: number;
  /** Whether to show +/- sign (default: false). */
  sign?: boolean;
}

/**
 * Formats a number as a percentage. The value is treated as an already-
 * calculated percentage (e.g. pass 12.3 for "12.3%"), not a fraction.
 *
 * Returns "—" for null, undefined, and NaN.
 */
export function formatPercent(
  value: number | null | undefined,
  options: FormatPercentOptions = {},
): string {
  if (value == null || Number.isNaN(value)) return NULL_DISPLAY;

  const { locale, decimals = 1, sign = false } = options;

  // Intl.NumberFormat percent style expects a fraction (0.123 = 12.3%),
  // but our API takes the already-calculated percentage, so divide by 100.
  const fraction = value / 100;

  const formatOptions: Intl.NumberFormatOptions = {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: sign ? "exceptZero" : "auto",
  };

  return new Intl.NumberFormat(locale, formatOptions).format(fraction);
}
