---
name: PriorityPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Select, Badge]
replaces-raw: []
---

# PriorityPicker

> A select control for choosing a priority level, rendered with the canonical priority badge.

## Purpose
PriorityPicker owns the priority enum — `urgent`, `high`, `medium`, `low`, `none` — and its visual mapping. By centralizing the level → label + color + icon rules here, every product surface displays priority identically and the enum can evolve in one place.

## When to use
- A task, ticket, or record needs a priority level
- An inline priority control on a row or detail panel
- Replacing ad-hoc colored-text priority dropdowns

## When NOT to use
- Workflow state → use **WorkflowStatePicker**
- Free-form labels → use **LabelPicker**
- Read-only priority display in a row → render `Badge` directly via this enum

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2">` (badge + select) | hand-rolled flex/gap |
| Underlying input | `Select>`                         | raw `<select>` / hand-rolled menu  |
| Selected indicator | `Badge variant=…>` for the chosen priority | raw colored `<span>`        |
| Option rendering | `Badge` inside `Select` option slots | inline color spans               |

## API contract
```ts
type Priority = "urgent" | "high" | "medium" | "low" | "none";

interface PriorityPickerProps extends HTMLAttributes<HTMLDivElement> {
  value: Priority;
  onChange: (next: Priority) => void;
  disabled?: boolean;
  placeholder?: ReactNode;            // shown when value === "none"
}
```
Component uses `forwardRef<HTMLDivElement, PriorityPickerProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders `Badge` for current priority + `Select` trigger               |
| none     | Renders neutral placeholder (e.g. "No priority")                      |
| open     | `Select` reveals options; each option shows priority `Badge` + label  |
| disabled | Select non-interactive; badge dim                                     |

## Accessibility
- Inherits combobox semantics from `Select` — `aria-haspopup`, `aria-expanded`.
- Each option's accessible name is the priority label text, not the color.
- Color is never the only signal; the `Badge` always carries text.

## Tokens
- Priority badge tokens (declared on `Badge` variants):
  - `--priority-color-{urgent|high|medium|low|none}`
  - `--priority-surface-{urgent|high|medium|low|none}`
- Gap inherited from `Box`: `--space-2`

## Do / Don't
```tsx
// DO
<PriorityPicker value={task.priority} onChange={setPriority} />

// DON'T — color-only swatch
<div style={{ background: "red" }} onClick={open}/>

// DON'T — bypass enum
<Select value={"P0"} options={["P0", "P1", "P2"]} />
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
- Each priority value renders its `Badge` with the right token mapping
- Selecting an option fires `onChange` with the new value
- `value="none"` renders the placeholder
- `disabled` prevents interaction
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Select"]` and `[data-component="Badge"]` resolve
- axe-core passes in default and open states
