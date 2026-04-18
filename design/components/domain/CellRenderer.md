---
name: CellRenderer
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box]
replaces-raw: []
---

# CellRenderer

> A registry that dispatches a value to the right domain component based on its data type.

## Purpose
CellRenderer is the single dispatch surface for "given a value and its type, render it the canonical way." It dispatches `currency` → `Currency`, `timestamp` → `Timestamp`, `status` → `StatusBadge`, `user` → `UserChip`, `trend` → `TrendIndicator`, `metric` → `MetricValue`, etc. — so a `DataTable` column definition can declare a type and the renderer guarantees consistent rendering across every table in the product.

## When to use
- Inside `DataTable` for typed columns
- Anywhere a value's display format is determined by its data type at runtime
- Bulk dashboards that serialize column definitions from config

## When NOT to use
- A column needs custom JSX → render the JSX directly; don't add a one-off type to the registry
- A primitive value with default formatting is fine → `Text` is sufficient
- A non-tabular surface where types aren't dispatched → use the specific domain component directly

## Composition (required)
The implementation MUST dispatch to existing domain components — never re-implement their behavior.

| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box>` only when wrapping is needed for alignment      | hand-rolled flex/padding in CSS      |
| `currency`      | `Currency value={…} currency={…}>`                     | inline `Intl.NumberFormat`           |
| `number`        | `MetricValue value={…}>` or `Text` with `formatNumber` | inline `toLocaleString`              |
| `percent`       | `MetricValue value={…} format="percent">`              | inline percent math                  |
| `timestamp`     | `Timestamp value={…}>`                                 | inline `Date#toLocaleString`         |
| `status`        | `StatusBadge status={…}>`                              | bespoke colored chip                 |
| `user`          | `UserChip user={…}>`                                   | raw avatar + name JSX                |
| `trend`         | `TrendIndicator direction={…} delta={…}>`              | inline ▲/▼ glyphs                    |
| `sparkline`     | `Sparkline data={…}>`                                  | inline `<svg>`                       |
| `tag` / `tags`  | base `Tag` (one per value)                             | raw styled `<span>`                  |
| `text` (default)| `Text>`                                                | raw `<span>`                         |
| `null` / `undefined` | em-dash `—` (U+2014)                              | empty string                         |

> Note: CellRenderer chooses the right domain component by `type`. It never re-implements formatting — it always defers to the component listed above.

## API contract
```ts
type CellType =
  | "text" | "number" | "currency" | "percent"
  | "timestamp" | "status" | "user" | "trend"
  | "sparkline" | "tag" | "tags";

interface CellRendererProps extends HTMLAttributes<HTMLSpanElement> {
  type: CellType;
  value: unknown;
  options?: Record<string, unknown>;   // type-specific options (e.g., currency code)
  align?: "start" | "end";             // hint for alignment in tables
}
```
Forwarded ref targets the root `<span>`. Remaining props are spread onto the root.

## Required states
| State            | Behavior                                                              |
|------------------|-----------------------------------------------------------------------|
| each `type`      | Dispatches to the corresponding component above                       |
| `value == null`  | Renders em-dash `—` regardless of type                                |
| unknown type     | Renders `Text` fallback; warns in development                         |
| numeric align    | `align="end"` applies tabular-nums + right alignment                  |

## Accessibility
- The dispatched component carries its own a11y semantics; CellRenderer adds no extra roles.
- `null` em-dash uses `aria-label="No value"` for screen readers.
- Numeric columns rely on `Text` `tabular-nums` for predictable column widths.

## Tokens
- Inherits all tokens from the dispatched components
- Adds (component tier): none

## Do / Don't
```tsx
// DO
<CellRenderer type="currency" value={1240} options={{ currency: "USD" }} />
<CellRenderer type="status" value="active" />
<CellRenderer type="user" value={user} />

// DON'T — re-implement formatting
<span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)}</span>

// DON'T — bypass the registry with a one-off type
<CellRenderer type="my-special-thing" value={…} />   // build the column with JSX instead
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (delegate to a domain component)
- Inline `Intl.NumberFormat` / `toLocaleString` (delegate)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (delegate to `TrendIndicator`)
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `type` dispatches to the expected component (composition probe)
- `value == null` renders em-dash for every type
- Unknown type renders `Text` fallback and logs a warning in dev
- `align="end"` applies tabular numeric alignment
- `options` are forwarded to the dispatched component
- Forwards ref; spreads remaining props onto root
- axe-core passes for representative types (currency, status, user, timestamp)
