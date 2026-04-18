---
name: DependencyLink
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Text, Tooltip]
replaces-raw: []
---

# DependencyLink

> A compact reference to another task that this work depends on, or that depends on this work.

## Purpose
DependencyLink is the canonical chip for surfacing a task-to-task relationship — "blocked by", "blocks", "related to". It owns the relationship-icon mapping, status decoration, and tooltip explanation so dependency graphs across boards, tables, and detail panels read the same way.

## When to use
- A task panel lists "Blocked by" or "Blocks" relationships
- A row needs a small "depends on X" affordance
- A timeline cell shows an upstream/downstream pointer

## When NOT to use
- A general task card → use **TaskCard**
- A free-form link/URL → use a Link/anchor component
- A workflow state picker → use **WorkflowStatePicker**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="1" padding="1">` | hand-rolled flex/padding |
| Relationship icon | `Icon size="sm">`                | inline `<svg>`                     |
| Linked task title | `Text size="sm" weight="medium" truncate>` | raw styled `<span>`        |
| Status hint text | `Text size="caption" color="secondary">` | raw `<span>`                |
| Tooltip         | `Tooltip>` wrapping the row        | raw `title=""` attribute           |

## API contract
```ts
type DependencyRelation = "blocks" | "blocked-by" | "related-to" | "duplicate-of";

interface DependencyLinkProps extends HTMLAttributes<HTMLSpanElement> {
  relation: DependencyRelation;
  title: ReactNode;                   // linked task title
  status?: ReactNode;                 // optional status hint (e.g. "In progress")
  href?: string;                      // when set, the row navigates
  onActivate?: () => void;            // alternative to href
  tooltip?: ReactNode;                // overrides default tooltip copy
}
```
Component uses `forwardRef<HTMLSpanElement, DependencyLinkProps>`. Either `href` or `onActivate` makes the row activatable; the activation goes through a `Button`/anchor inside the implementation, never an `onClick` `<div>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| blocks       | Right-arrow icon + tooltip "Blocks"                               |
| blocked-by   | Left-arrow icon + tooltip "Blocked by"                            |
| related-to   | Link icon + tooltip "Related to"                                  |
| duplicate-of | Copy icon + tooltip "Duplicate of"                                |
| activatable  | Whole row reachable by keyboard via internal `Button`/anchor      |
| read-only    | No `href`/`onActivate` → row is plain text                        |

## Accessibility
- Relation is conveyed by both icon and the tooltip/SR text — never color alone.
- When activatable, the row uses semantic `<button>`/`<a>` (via the appropriate component) with focus ring and Enter/Space activation.
- Tooltip is reachable via keyboard focus.

## Tokens
- Icon color: `--dependency-link-icon-{blocks|blocked-by|related-to|duplicate-of}`
- Hover surface: `--dependency-link-surface-hover`
- Padding/gap inherited from `Box`: `--space-1`
- Radius: `--radius-sm`

## Do / Don't
```tsx
// DO
<DependencyLink relation="blocked-by" title="Set up CI" status="In progress" href={url} />

// DON'T — generic chip with arrow glyph
<span>← Set up CI</span>     // missing semantics, color-only

// DON'T — clickable div
<div onClick={open}>↑ Set up CI</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `relation` renders the correct icon and default tooltip
- `href` makes the row a keyboard-activatable link
- `onActivate` makes the row a keyboard-activatable button
- `tooltip` override appears
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Tooltip"]`, `[data-component="Icon"]`, `[data-component="Text"]` resolve
- axe-core passes in read-only and activatable forms
