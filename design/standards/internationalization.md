# Internationalization

Data applications often serve global audiences. Numbers, dates, currencies, and units are culturally variable, and layouts must accommodate right-to-left scripts and text expansion.

## Number Formatting

Number formats vary by locale:

| Locale | Thousands | Decimal | Example |
|--------|-----------|---------|---------|
| en-US | , | . | 1,234,567.89 |
| de-DE | . | , | 1.234.567,89 |
| fr-FR | (space) | , | 1 234 567,89 |
| ja-JP | , | . | 1,234,567.89 |

**Implementation:**
- All number formatting uses `Intl.NumberFormat` with the user's locale.
- Formatting is centralized in a `formatNumber()` utility — components never format numbers inline.
- Tabular numerals (`font-variant-numeric: tabular-nums`) are used regardless of locale.
- Compact notation (1.2K, 3.4M) uses `Intl.NumberFormat` with `notation: "compact"`.

## Currency

| Locale | Symbol | Position | Example |
|--------|--------|----------|---------|
| en-US | $ | Before | $1,234.56 |
| de-DE | EUR | After | 1.234,56 EUR |
| ja-JP | ¥ | Before | ¥1,234 |
| en-GB | £ | Before | £1,234.56 |

**Implementation:**
- Use `Intl.NumberFormat` with `style: "currency"`.
- Never hardcode currency symbols or positions.
- When displaying mixed currencies, always show the currency code (USD, EUR) alongside the symbol for clarity.

## Date & Time

| Locale | Date | Time |
|--------|------|------|
| en-US | 03/15/2025 or Mar 15, 2025 | 2:30 PM |
| de-DE | 15.03.2025 or 15. Mär. 2025 | 14:30 |
| ja-JP | 2025/03/15 or 2025年3月15日 | 14:30 |

**Implementation:**
- Use `Intl.DateTimeFormat` with the user's locale and appropriate format options.
- **Relative dates** ("2 hours ago", "yesterday") use `Intl.RelativeTimeFormat`.
- All timestamps include timezone information in tooltips.
- ISO 8601 format (2025-03-15T14:30:00Z) is used for data interchange, never for display.

### Date Display Strategy

| Recency | Format |
|---------|--------|
| < 1 minute | "Just now" |
| < 1 hour | "X minutes ago" |
| < 24 hours | "X hours ago" |
| < 7 days | "X days ago" or day name ("Monday") |
| Same year | "Mar 15" or locale equivalent |
| Different year | "Mar 15, 2024" or locale equivalent |

Full date + time is always available in a tooltip.

## Text Expansion

Translated text can be significantly longer than English:

| Language | Typical expansion |
|----------|------------------|
| German | 30% longer |
| Finnish | 30-40% longer |
| French | 15-20% longer |
| Japanese | 10-20% shorter |
| Chinese | 20-30% shorter |

**Design implications:**
- Button labels must accommodate 40% expansion without breaking layout.
- Table column headers must not be sized to fit English text exactly.
- Navigation labels should be testable with pseudo-localization (e.g., "Ēxpōrt" for "Export").
- Layouts use flexible widths wherever possible. Fixed-width containers that size to English content will break in German.

**Testing:** Run pseudo-localization during development to surface expansion issues early. Pseudo-localization replaces characters with accented equivalents and adds ~30% length: "Export" → "[Ēxpöŕţ Ēxpö]".

## Right-to-Left (RTL) Support

Arabic, Hebrew, and other RTL scripts require layout mirroring.

### What Mirrors

- **Text alignment**: Left-aligned becomes right-aligned.
- **Flex/Grid direction**: Row direction reverses.
- **Margins and padding**: Logical properties (`margin-inline-start` instead of `margin-left`).
- **Icons**: Directional icons (arrows, chevrons, "back" icons) mirror.
- **Navigation**: Sidebar moves from left to right.
- **Progress**: Progress bars fill from right to left.

### What Does Not Mirror

- **Non-directional icons**: Checkmarks, X, status icons remain unchanged.
- **Numbers**: Always displayed left-to-right, even in RTL context.
- **Charts**: Axes maintain their mathematical convention (X left-to-right, Y bottom-to-top).
- **Media controls**: Play/pause/skip maintain universal direction.
- **Logos and brand marks**: Never mirrored.

### Implementation

- Use CSS logical properties exclusively: `margin-inline-start`, `padding-block-end`, `inset-inline-start`.
- Never use `margin-left`/`margin-right` or `padding-left`/`padding-right`.
- Set `dir="rtl"` on the `<html>` element. Components inherit direction automatically via logical properties.
- Test with actual RTL text (Arabic or Hebrew), not just `dir="rtl"` — actual text reveals line-breaking and text-mixing issues that direction alone doesn't.

## Units & Measurements

- Use the user's locale preference for measurement units (metric vs. imperial).
- Always display the unit abbreviation alongside the value: "15 km", "72°F".
- Provide unit conversion on hover or in a tooltip when the displayed unit may not be the user's preference.
- Store values in a canonical unit (SI/metric) and convert for display.

## Locale Configuration

- Locale is set at the application level, affecting all formatting.
- Users can override specific settings (date format, time zone, number format) in their preferences.
- Timezone is auto-detected from the browser and can be overridden by the user.
- All locale-dependent formatting flows through centralized utilities that respect the configured locale.
