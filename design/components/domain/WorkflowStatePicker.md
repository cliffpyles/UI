---
name: WorkflowStatePicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Select, Button, Badge]
replaces-raw: []
---

# WorkflowStatePicker

> A dropdown for moving a record through its workflow states (e.g., Backlog → In Progress → Done).

## Purpose
WorkflowStatePicker owns the "change status" action for any workflow-driven record. It renders the current state as a `Badge`, exposes the allowed next states (respecting transitions), and offers a quick "advance" `Button` for the most common forward move. Centralizing this prevents per-feature status menus from drifting in label, color, and transition rules.

## When to use
- A task, ticket, or deal needs to move between defined workflow states
- Inline status change control on a row, card, or detail panel
- Restricted state transitions where some moves are not allowed

## When NOT to use
- Priority value → use **PriorityPicker**
- Free-form labels → use **LabelPicker**
- Read-only status display → render the canonical workflow `Badge` directly

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2">` | hand-rolled flex/gap         |
| Current state   | `Badge variant=…>` for the current state | raw colored `<span>`         |
| State picker    | `Select>` with badge-decorated options   | raw `<select>` / hand-rolled menu |
| Quick-advance action | `Button variant="ghost" size="sm">`  | raw `<button>`                    |

## API contract
```ts
interface WorkflowState {
  id: string;
  name: string;
  variant: "neutral" | "primary" | "success" | "warning" | "error";
}

interface WorkflowStatePickerProps extends HTMLAttributes<HTMLDivElement> {
  states: WorkflowState[];
  value: string;                                 // current state id
  onChange: (next: string) => void;
  allowedTransitions?: (from: string) => string[];   // returns ids of valid targets
  nextState?: string;                            // id of recommended forward state → renders quick advance Button
  disabled?: boolean;
}
```
Component uses `forwardRef<HTMLDivElement, WorkflowStatePickerProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| default      | Renders current `Badge` + `Select` trigger                        |
| with-advance | When `nextState` set, renders trailing `Button` ("Mark as ${name}") |
| restricted   | `allowedTransitions` filters the `Select` options                 |
| open         | `Select` shows options decorated with `Badge`                     |
| disabled     | Select and advance button non-interactive                         |

## Accessibility
- Inherits combobox semantics from `Select`.
- Quick-advance `Button` has `aria-label="Advance to ${nextState.name}"`.
- Color is never the only signal; each option carries the state name as text.

## Tokens
- Inherits `Badge` variant tokens
- Gap inherited from `Box`: `--space-2`
- No new tokens

## Do / Don't
```tsx
// DO
<WorkflowStatePicker
  states={states} value={task.stateId} onChange={setState}
  allowedTransitions={getAllowed} nextState={"in_review"} />

// DON'T — bypass transitions
<Select options={allStates} /> // exposes invalid moves

// DON'T — color-only
<div style={{ background: "green" }}>{state.name}</div>
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
- Current state renders as `Badge`
- Selecting an option fires `onChange`
- `allowedTransitions` filters the option list correctly
- `nextState` renders quick advance `Button` that fires `onChange(nextState)`
- `disabled` prevents interaction on both controls
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Select"]`, `[data-component="Badge"]` resolve
- axe-core passes in default, open, and disabled states
