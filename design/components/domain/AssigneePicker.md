---
name: AssigneePicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, UserPicker]
replaces-raw: []
---

# AssigneePicker

> A specialized user picker for assigning one or more people to a record.

## Purpose
AssigneePicker is the canonical "who owns this?" control for tasks, tickets, deals, incidents, and any record that has assignees. It wraps `UserPicker` with assignment-specific defaults — empty-state copy ("Unassigned"), single vs. multi mode, and the "Assign to me" shortcut — so every assignment surface in the product behaves identically.

## When to use
- A task/ticket/incident needs an owner
- A deal or account needs a primary or shared assignee set
- An inline assignment control on a row, card, or detail panel

## When NOT to use
- A general user search not tied to assignment semantics → use **UserPicker**
- Reviewer/approver selection → consider a dedicated reviewer component
- Multi-select tagging of arbitrary users → use **UserPicker** with `multi`

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2">` | hand-rolled flex/gap         |
| User search/select | `UserPicker>`                   | reimplementing search popover, avatar list |
| Empty state ("Unassigned") | provided through `UserPicker` `placeholder` slot | hand-rolled placeholder JSX |
| "Assign to me" shortcut | passed via `UserPicker` `actions` slot | raw `<button>`              |

## API contract
```ts
interface AssigneePickerProps extends HTMLAttributes<HTMLDivElement> {
  value: UserId | UserId[] | null;
  onChange: (next: UserId | UserId[] | null) => void;
  multi?: boolean;                    // default false
  currentUserId?: UserId;             // enables "Assign to me"
  disabled?: boolean;
  placeholder?: ReactNode;            // default "Unassigned"
}
```
Component uses `forwardRef<HTMLDivElement, AssigneePickerProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| unassigned   | `value === null` (or `[]`) → renders "Unassigned" placeholder     |
| single       | `multi=false` → one assignee, single-select inside picker         |
| multi        | `multi=true` → array of assignees, removable chips inside picker  |
| disabled     | Picker non-interactive; chips remain visible                      |
| with current user | "Assign to me" action visible at top of options when `currentUserId` provided |

## Accessibility
- Inherits combobox semantics from `UserPicker` (`role="combobox"`, `aria-expanded`, `aria-controls`).
- Empty state has SR text "No assignee" so the control reads meaningfully.
- "Assign to me" action is keyboard reachable as the first option.

## Tokens
- No new tokens; inherits everything from `UserPicker`
- Gap inherited from `Box`: `--space-2`

## Do / Don't
```tsx
// DO
<AssigneePicker value={task.assigneeId} onChange={setAssignee} currentUserId={me.id} />

// DO — multi
<AssigneePicker multi value={incident.assigneeIds} onChange={setAssignees} />

// DON'T — reimplement the popover
<Popover><UserList .../></Popover>

// DON'T — inline "me" button outside the picker
<AssigneePicker .../><button onClick={assignToMe}>Me</button>
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
- Renders "Unassigned" placeholder when `value` is null/empty
- `multi` mode supports adding and removing assignees
- "Assign to me" appears when `currentUserId` is provided and selects that user
- `disabled` prevents interaction
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="UserPicker"]` resolves
- axe-core passes in unassigned, single, and multi states
