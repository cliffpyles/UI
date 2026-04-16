# Typography

Typography in data-intensive applications faces challenges that general-purpose type systems don't address. Columns of numbers must align. Labels must remain legible at 11-12px. Hierarchy must be established without large size differences that waste vertical space.

## Type Scale

The scale is designed for data-density contexts where large type differences are unaffordable.

| Token | Size | Use |
|-------|------|-----|
| `font.size.2xs` | 0.625rem (10px) | Micro labels, chart axis ticks (use sparingly) |
| `font.size.xs` | 0.75rem (12px) | Table cells in compact density, metadata, timestamps |
| `font.size.sm` | 0.875rem (14px) | Default body text in compact density, secondary labels |
| `font.size.base` | 1rem (16px) | Default body text, form inputs, primary labels |
| `font.size.lg` | 1.125rem (18px) | Section headings, card titles |
| `font.size.xl` | 1.25rem (20px) | Page section headings |
| `font.size.2xl` | 1.5rem (24px) | Page titles |
| `font.size.3xl` | 1.875rem (30px) | Dashboard hero metrics |
| `font.size.4xl` | 2.25rem (36px) | Large display numbers (rare) |

The scale is intentionally compressed at the small end (10-16px) where data apps spend most of their time, with wider steps at the large end where exact sizing matters less.

## Font Families

| Token | Stack | Use |
|-------|-------|-----|
| `font.family.sans` | system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif | All UI text |
| `font.family.mono` | ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace | Code, IDs, technical values |

## Tabular Numerals

**All numeric data must use tabular (monospaced) numerals** so that columns of numbers align correctly. This is achieved via `font-variant-numeric: tabular-nums` on any element displaying numeric data.

This applies to:
- Table cells containing numbers
- Metric displays
- Chart axis labels
- Form inputs for numeric values
- Timestamps and durations

The system font stacks above all support `tabular-nums`. If a custom font is used for white-labeling, it must include tabular numeral support or the system will fall back to the default stack for numeric contexts.

## Font Weights

| Token | Weight | Use |
|-------|--------|-----|
| `font.weight.normal` | 400 | Body text, table cells, descriptions |
| `font.weight.medium` | 500 | Labels, form field labels, subtle emphasis |
| `font.weight.semibold` | 600 | Section headings, column headers, active states |
| `font.weight.bold` | 700 | Page titles, metric values, strong emphasis |

**Rule:** Hierarchy is primarily established through weight and color, not size. In dense UIs, a 12px semibold label is more effective than a 16px normal-weight label because it uses less vertical space while remaining distinct.

## Line Height

| Token | Value | Use |
|-------|-------|-----|
| `font.lineHeight.tight` | 1.25 | Headings, single-line labels, compact table cells |
| `font.lineHeight.normal` | 1.5 | Body text, descriptions, multi-line content |
| `font.lineHeight.relaxed` | 1.75 | Long-form text, documentation (rare in data UIs) |

In compact density, `tight` line height is used for most content. In default density, `normal` is used for body text and `tight` for headings.

## Hierarchy Without Size

In data-dense layouts, establishing visual hierarchy through font-size alone wastes space. The system uses a combination of:

1. **Weight**: semibold headers over normal-weight values.
2. **Color**: `color.text.primary` for key information, `color.text.secondary` for supporting details, `color.text.tertiary` for metadata.
3. **Case**: Uppercase sparingly for category labels or column group headers (always with letter-spacing: 0.05em for legibility).
4. **Size**: Only when the above three are insufficient to create the needed distinction.

## Truncation & Overflow

When text doesn't fit its container:

| Strategy | When to use |
|----------|-------------|
| **Truncate with ellipsis** | Single-line values in tables, labels, tags. Always provide the full value in a tooltip. |
| **Wrap** | Descriptions, notes, multi-line content areas. |
| **Scroll** | Code blocks, log output, technical content where preserving exact formatting matters. |
| **Fade** | Horizontal scroll indicators for wide content in constrained containers. |

**Rules:**
- Never truncate numeric values — a truncated number is misleading. If the number doesn't fit, widen the column or use a compact number format (1.2K, 3.4M).
- Never truncate status labels — the meaning must always be fully visible.
- Truncated text always has a tooltip showing the full value.

## Data Formatting

Numeric and temporal data follows consistent formatting rules:

| Type | Format | Examples |
|------|--------|---------|
| Integers | Thousands separator | 1,234 / 1,234,567 |
| Decimals | Fixed precision per context | 98.6% / $1,234.56 |
| Large numbers | Compact notation | 1.2K / 3.4M / 1.2B |
| Dates | Relative when recent, absolute otherwise | "2 hours ago" / "Mar 15, 2025" |
| Timestamps | 24h or 12h per locale | 14:30:00 / 2:30 PM |
| Durations | Human-readable | 2h 15m / 3d 4h |
| Currency | Symbol + value, locale-aware | $1,234.56 / EUR 1.234,56 |
| Percentages | Value + % | 98.6% |

See [Internationalization](../standards/internationalization.md) for locale-specific formatting rules.
