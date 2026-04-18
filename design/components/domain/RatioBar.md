---
name: RatioBar
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# RatioBar

> A horizontal part/whole bar with optional segmented breakdown and inline labels.

## Purpose
RatioBar visualizes a ratio of one or more parts to a whole — quota usage, plan utilization, status mix. It owns segment layout, semantic color mapping, and the optional value/percent label so every ratio bar in the product reads the same. Unlike `ProgressBar`, RatioBar is non-task and supports multi-segment breakdowns.

## When to use
- Quota / storage usage with optional warning thresholds
- Status-mix breakdown across a row of items ("48 done · 12 in-progress · 3 failed")
- Inline part/whole indicator next to a row label

## When NOT to use
- A determinate task progress → use **ProgressBar**
- A standalone numeric percent → use **Percentage**
- A trend over time → use **Sparkline**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="flex" direction="column" gap="2xs">` for label row + bar | hand-rolled flex CSS |
| Bar track       | `Box>` (the bar surface)                         | raw `<div>` with track CSS     |
| Each segment    | `Box>` (positioned/widthed by props)             | raw `<div>` with segment CSS   |
| Caption / value | `Text size="sm" color="secondary">`              | raw styled `<span>`            |

## API contract
```ts
type RatioSegment = {
  value: number;
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

interface RatioBarProps extends HTMLAttributes<HTMLDivElement> {
  segments: RatioSegment[];
  total?: number;                    // defaults to sum of segments
  showLegend?: boolean;
  caption?: ReactNode;
  size?: "sm" | "md" | "lg";
}
```

## Required states
| State        | Behavior                                                       |
|--------------|----------------------------------------------------------------|
| single       | One segment, renders as a simple usage bar                     |
| segmented    | Multiple segments, each colored by `tone`                      |
| over capacity | Sum exceeds `total` → overflow segment rendered with `danger` |
| empty        | All segments zero → empty track with `aria-label`              |
| with legend  | `showLegend` renders segment labels + values below the bar     |

## Accessibility
- Root: `role="img"` with `aria-label` summarizing segments ("3 of 4 used, 75 percent")
- Segments not individually focusable; legend provides per-segment text
- Tone conveyed by both color and label text — never color alone

## Tokens
- Inherits surface tokens from `Box`
- Adds: `--ratio-bar-height-{sm|md|lg}`, `--ratio-bar-radius`, `--ratio-bar-gap`

## Do / Don't
```tsx
// DO
<RatioBar segments={[
  { value: 48, label: "Done", tone: "success" },
  { value: 12, label: "In progress", tone: "info" },
  { value: 3,  label: "Failed", tone: "danger" },
]} showLegend />

// DON'T — hand-rolled colored divs
<div className="bar"><div style={{ width: "75%", background: "#0a0" }}/></div>

// DON'T — use ProgressBar for non-task ratios
<ProgressBar value={75}/>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Single segment renders correct width relative to `total`
- Multi-segment widths sum to 100% and respect order
- Over-capacity renders an overflow segment with `danger` tone
- `showLegend` renders one entry per segment with label + value
- Empty segments render an empty track with `aria-label`
- Forwards ref; spreads remaining props onto root
- axe-core passes; `role="img"` with summary `aria-label`
