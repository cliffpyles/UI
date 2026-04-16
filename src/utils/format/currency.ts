const NULL_DISPLAY = "\u2014";

export interface FormatCurrencyOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Number of decimal places. Defaults to currency standard (e.g. 2 for USD). */
  decimals?: number;
}

/**
 * Formats a number as currency with locale-appropriate symbol placement
 * and decimal rules.
 *
 * Returns "—" for null, undefined, and NaN.
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string,
  options: FormatCurrencyOptions = {},
): string {
  if (value == null || Number.isNaN(value)) return NULL_DISPLAY;

  const { locale, decimals } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
  };

  if (decimals !== undefined) {
    formatOptions.minimumFractionDigits = decimals;
    formatOptions.maximumFractionDigits = decimals;
  }

  return new Intl.NumberFormat(locale, formatOptions).format(value);
}
