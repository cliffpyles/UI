---
name: ChangeLog
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Divider]
---

# ChangeLog

> A list of field-level before/after diffs with semantic add / remove / change styling.

## Purpose
ChangeLog renders a structured set of field changes in the format reviewers expect: field name, old value, arrow, new value. It exists so that audit drawers, version diffs, and approval queues do not each invent a different diff layout. It is intentionally narrow — it diffs scalar field values, not free-form text or structured documents.

## When to use
- Showing what changed in an entity update (audit, approval, history)
- Rendering "what will change" in a confirm modal before applying
- Inline diff for settings, permissions, or configuration changes

## When NOT to use
- Free-form text diffs (paragraph-level red/green) → use a dedicated text-diff component
- Structured JSON / code diffs → use a code diff viewer
- Activity stream entries → use **ActivityItem**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for change list; `Box direction="row" gap` per row | hand-rolled flex / padding in CSS |
| Field name      | `Text size="sm" color="secondary">`  | raw styled `<span>`                  |
| Old / new value | `Text` with semantic color classes (`color="error"` for removed, `color="success"` for added) | inline color CSS |
| Row separator   | `Divider` (between groups; rows themselves rely on layout gap) | hand-rolled `border-bottom` |

## API contract
```ts
type FieldChangeKind = "added" | "removed" | "changed";

interface FieldChange {
  field: string;
  kind: FieldChangeKind;
  before?: ReactNode;                   // omitted when kind === "added"
  after?: ReactNode;                    // omitted when kind === "removed"
}

interface ChangeLogProps extends HTMLAttributes<HTMLElement> {
  changes: FieldChange[];
  groupBy?: (change: FieldChange) => string;   // optional grouping label
}
```
Renders as `<section>`; forwards ref to it.

## Required states
| State    | Behavior                                                                 |
|----------|--------------------------------------------------------------------------|
| empty    | "No changes" rendered via `Text color="secondary"`                       |
| added    | Row shows only the new value with success-colored `Text`                 |
| removed  | Row shows only the old value with error-colored `Text`                   |
| changed  | Row shows old → new, both wrapped in `Text` with explicit semantic colors|
| grouped  | When `groupBy` is set, groups are separated by `Divider` and a heading   |

## Accessibility
- Each row text MUST include a textual indicator of kind (e.g. "added", "removed", "changed from … to …") — color is never the sole signal
- Root `<section>` has `aria-label="Change log"` by default; consumers can override
- Field name is the row's accessible label

## Tokens
- Inherits all tokens from `Text`, `Divider`
- Adds (component tier): `--change-log-row-gap`, `--change-log-arrow-color`

## Do / Don't
```tsx
// DO
<ChangeLog changes={[{ field: "Owner", kind: "changed", before: "Alex", after: "Sam" }]} />

// DON'T — color-only diff
<span style={{ color: "red" }}>{before}</span> → <span style={{ color: "green" }}>{after}</span>

// DON'T — accept arbitrary JSX rows (loses semantics)
<ChangeLog>{customRows}</ChangeLog>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓) — the arrow MUST be an `Icon` if visual, else plain text "→"
- Hardcoded color, spacing, radius, shadow, duration, z-index
- Color-only signaling for kind (must include text)
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Empty `changes` renders the empty `Text`
- Each kind renders with its semantic color and an explicit text indicator
- `groupBy` produces grouped output separated by `Divider`s
- Forwards ref; spreads remaining props onto root `<section>`
- Composition probe: `Text` and `Divider` render inside output
- axe-core passes in empty, added, removed, changed, grouped
