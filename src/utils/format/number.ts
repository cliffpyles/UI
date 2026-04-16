const NULL_DISPLAY = "\u2014";

export interface FormatNumberOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Number of decimal places. */
  decimals?: number;
  /** Minimum number of decimal places. */
  minDecimals?: number;
}

/**
 * Formats a number with locale-appropriate thousands separators
 * and configurable decimal precision.
 *
 * Returns "—" for null, undefined, and NaN.
 */
export function formatNumber(
  value: number | null | undefined,
  options: FormatNumberOptions = {},
): string {
  if (value == null || Number.isNaN(value)) return NULL_DISPLAY;

  const { locale, decimals, minDecimals } = options;

  const formatOptions: Intl.NumberFormatOptions = {};

  if (decimals !== undefined) {
    formatOptions.maximumFractionDigits = decimals;
  }

  if (minDecimals !== undefined) {
    formatOptions.minimumFractionDigits = minDecimals;
  } else if (decimals !== undefined) {
    formatOptions.minimumFractionDigits = decimals;
  }

  return new Intl.NumberFormat(locale, formatOptions).format(value);
}
