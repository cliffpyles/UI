---
name: Sparkline
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box]
replaces-raw: ["<svg> used for inline trend chart"]
---

# Sparkline

> An inline micro-chart showing a value series at a glance — no axes, no labels.

## Purpose
Sparkline draws a small SVG trend line/area for use inside metric tiles, table cells, and list rows. It owns the SVG construction, the line/area/bar shape, the optional reference markers, and the textual `aria-label` summary. No other component in the system may render an inline `<svg>` for trends.

## When to use
- The micro-chart slot inside a `MetricCard`
- A trend column in a table or list row
- Any "shape of recent values" cue where axes would be noise

## When NOT to use
- A real chart with axes, legend, tooltip → use the chart library (out of scope here)
- A single-value indicator → use **MetricValue** + **TrendIndicator**
- A part/whole breakdown → use **RatioBar**

## Composition (required)
| Concern         | Use                                          | Never                          |
|-----------------|----------------------------------------------|--------------------------------|
| Internal layout | `Box display="block">` as the SVG container  | hand-rolled positioning CSS    |
| Chart drawing   | Owns `<svg>` (only component permitted to)   | inline `<svg>` outside this    |
| Empty / loading | Renders an empty track with `aria-label`     | hand-rolled placeholder        |

## API contract
```ts
interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
  data: number[];
  shape?: "line" | "area" | "bar";   // default "line"
  width?: number;                    // px; default 80
  height?: number;                   // px; default 24
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  showLast?: boolean;                // mark the last point
  baseline?: number;                 // reference line
  ariaLabel: string;                 // required textual summary
}
```

## Required states
| State    | Behavior                                                          |
|----------|-------------------------------------------------------------------|
| default  | Series rendered in chosen `shape` and `tone`                      |
| empty    | `data.length === 0` → renders empty track with `aria-label`       |
| flat     | All values equal → renders a flat baseline                        |
| last point | `showLast` renders a marker at the final point                  |
| with baseline | `baseline` renders a reference line in secondary tone          |

## Accessibility
- Root: `role="img"` with caller-supplied `aria-label` summarizing the trend
- SVG marked `aria-hidden`; the label on the root carries semantics
- Tone conveyed by color + label text — never color alone

## Tokens
- Inherits surface tokens from `Box`
- Adds: `--sparkline-stroke`, `--sparkline-fill`, `--sparkline-baseline-color`, `--sparkline-marker-radius`

## Do / Don't
```tsx
// DO
<Sparkline data={[1,2,3,4,5,7]} ariaLabel="Revenue trend last 30 days, increasing" />
<Sparkline data={values} shape="area" tone="success" showLast ariaLabel="Sign-ups, last 14 days" />

// DON'T — inline SVG outside Sparkline
<svg><polyline points="…"/></svg>

// DON'T — use a full chart library where Sparkline fits
<LineChart data={tinySeries}/>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` outside this component
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `line`, `area`, `bar` shapes with correct path data
- `showLast` renders a marker at the final point
- Empty data renders an empty track with the supplied `aria-label`
- Flat data renders a flat baseline
- Forwards ref; spreads remaining props onto root
- axe-core passes; `role="img"` with `aria-label`
