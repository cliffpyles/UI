const NULL_DISPLAY = "\u2014";

export interface FormatCurrencyOptions {
  /** Locale for formatting. Defaults to user's locale. */
  locale?: string;
  /** Number of decimal places. Defaults to currency standard (e.g. 2 for USD). */
  decimals?: number;
  /** Sign placement. */
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  /** Notation: "standard" or "compact" (e.g. "$1.2K"). */
  notation?: "standard" | "compact";
}

function buildOptions(
  currency: string,
  options: FormatCurrencyOptions,
): Intl.NumberFormatOptions {
  const { decimals, signDisplay, notation } = options;
  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
  };
  if (decimals !== undefined) {
    formatOptions.minimumFractionDigits = decimals;
    formatOptions.maximumFractionDigits = decimals;
  }
  if (signDisplay) formatOptions.signDisplay = signDisplay;
  if (notation) formatOptions.notation = notation;
  return formatOptions;
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
  return new Intl.NumberFormat(options.locale, buildOptions(currency, options)).format(value);
}

export interface CurrencyParts {
  symbol: string;
  number: string;
}

/**
 * Splits a formatted currency into its symbol and number parts
 * using Intl.NumberFormat.formatToParts, preserving sign placement.
 */
export function formatCurrencyParts(
  value: number,
  currency: string,
  options: FormatCurrencyOptions = {},
): CurrencyParts {
  const parts = new Intl.NumberFormat(options.locale, buildOptions(currency, options)).formatToParts(value);
  let symbol = "";
  let number = "";
  for (const p of parts) {
    if (p.type === "currency") symbol += p.value;
    else number += p.value;
  }
  return { symbol, number: number.trim() };
}
