---
name: FileSize
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# FileSize

> A byte count rendered with the appropriate binary or decimal unit.

## Purpose
FileSize renders "1.2 MB" / "1.2 MiB" consistently across uploaders, storage dashboards, and audit logs. It owns the binary-vs-decimal convention, unit selection, precision, and the suffix typography so byte counts never appear hand-formatted.

## When to use
- File and asset sizes in lists, tables, and detail views
- Quota / usage indicators in storage dashboards
- Diff sizes in deploy or commit detail views

## When NOT to use
- A non-byte numeric quantity → use **MetricValue**
- A percentage of quota used → use **Percentage** with **RatioBar**
- A throughput rate ("MB/s") → product copy or a derived component

## Composition (required)
| Concern         | Use                                              | Never                            |
|-----------------|--------------------------------------------------|----------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="2xs">` | hand-rolled inline CSS    |
| Numeric value   | `Text size="inherit">`                           | raw styled `<span>`              |
| Unit suffix     | `Text size="inherit" color="secondary">`         | raw styled `<span>`              |
| Null            | `Text>—</Text>`                                  | empty render                     |

## API contract
```ts
interface FileSizeProps extends HTMLAttributes<HTMLSpanElement> {
  bytes: number | null;
  base?: "binary" | "decimal";       // default "binary" (KiB/MiB)
  precision?: number;                // default 1
  locale?: string;
  unit?: "auto" | "B" | "KB" | "MB" | "GB" | "TB";
}
```

## Required states
| State     | Behavior                                                          |
|-----------|-------------------------------------------------------------------|
| default   | Auto-selects unit, renders value + unit                           |
| zero      | Renders `0 B`                                                     |
| null      | Renders em-dash `—`                                               |
| forced    | `unit !== "auto"` renders in the requested unit                   |
| sub-unit  | Less than `1 B` → renders `< 1 B`                                 |

## Accessibility
- Full unabbreviated value available via `aria-label` ("1.23 megabytes")
- Unit suffix is part of the textual value, not color
- Inline-flex preserves baseline with surrounding text

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--file-size-unit-gap`

## Do / Don't
```tsx
// DO
<FileSize bytes={1_572_864} />               // "1.5 MiB"
<FileSize bytes={1_500_000} base="decimal"/> // "1.5 MB"

// DON'T — manual math
<span>{(bytes / 1024 / 1024).toFixed(1)} MB</span>

// DON'T — color the only differentiator
<span style={{ color: "gray" }}>MB</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders B / KiB / MiB / GiB at correct thresholds in `binary`
- `base="decimal"` switches threshold and unit names
- `unit="MB"` forces unit selection
- `bytes === null` renders `—`
- Forwards ref; spreads remaining props onto root
- axe-core passes; `aria-label` carries unabbreviated form
