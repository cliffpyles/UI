---
name: TaskCard
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Card, UserChip, DueDateIndicator, Badge, Text, Button]
replaces-raw: []
---

# TaskCard

> A compact card representation of a work item — title, assignee, due date, status, priority.

## Purpose
TaskCard is the canonical work-item card for boards, queues, and grouped lists. It composes the existing person/date/status/priority components in a fixed layout so that a task displayed on a Kanban column looks the same as one in a related-work sidebar or a search result row.

## When to use
- A column on a Kanban or Board view
- A "related work" panel inside a detail view
- A search result row representing a task

## When NOT to use
- A full task detail view → use a route + form components
- A row inside a dense data table → render through `Table`, not `TaskCard`
- A timeline event → use a timeline-specific component

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Surface         | `Card>`                            | raw `<div>` with surface CSS       |
| Internal layout | `Box direction="column" gap="2" padding="3">` | hand-rolled flex/padding |
| Footer row      | `Box direction="row" align="center" gap="2" justify="between">` | hand-rolled flex |
| Title text      | `Text size="sm" weight="medium" truncate>` | raw styled `<span>`        |
| Assignee chip   | `UserChip size="sm">`              | raw avatar+name combo              |
| Due date        | `DueDateIndicator>`                | inline date math / `toLocaleString` |
| Status pill     | `Badge variant=…>`                 | raw styled `<span>`                |
| Priority pill   | `Badge variant=…>` (priority tokens) | raw styled `<span>`              |
| Action menu trigger | `Button variant="ghost" size="xs">` + `Icon`  | raw `<button>` + svg     |

## API contract
```ts
interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  title: ReactNode;
  assignee?: { name: string; avatarUrl?: string };
  dueDate?: Date | string;
  dueStatus?: "ontime" | "due-soon" | "overdue" | "complete";
  status?: { label: string; variant: "neutral" | "primary" | "success" | "warning" | "error" };
  priority?: "urgent" | "high" | "medium" | "low" | "none";
  onOpen?: () => void;
  onAction?: () => void;              // overflow / quick-action trigger
}
```
Component uses `forwardRef<HTMLDivElement, TaskCardProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| default      | All optional sections rendered when their props are set           |
| no-assignee  | Assignee slot omitted (no placeholder unless explicitly provided) |
| no-due-date  | DueDateIndicator omitted                                          |
| activatable  | When `onOpen` set, card root is a `Button` (semantic) for activation |
| with-action  | When `onAction` set, trailing icon-only `Button` rendered         |

## Accessibility
- When activatable, the card uses semantic `<button>` via the underlying `Card`/`Button` composition (no clickable `<div>`).
- The accessible name is the `title`; assignee, due date, status, and priority are part of the description.
- Color is never the only signal — both `Badge` text and `DueDateIndicator` carry text.

## Tokens
- Surface inherited from `Card`: `--card-surface`, `--card-border`, `--card-radius`, `--card-shadow`
- Padding/gap inherited from `Box`: `--space-2`, `--space-3`

## Do / Don't
```tsx
// DO
<TaskCard
  title="Finalize Q3 plan"
  assignee={{ name: "Ada", avatarUrl }}
  dueDate={d} dueStatus="due-soon"
  status={{ label: "In review", variant: "warning" }}
  priority="high"
  onOpen={openTask} onAction={openMenu} />

// DON'T — reimplement chrome
<div className="task-card"><span>{title}</span><img className="avatar" src={url}/></div>

// DON'T — inline date format
<TaskCard dueDate={`${d.getMonth()+1}/${d.getDate()}`} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `Intl.DateTimeFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders title; missing optional fields omit their slots cleanly
- `onOpen` makes the card keyboard-activatable
- `onAction` renders trailing action `Button`; activates without firing `onOpen`
- `dueStatus` is forwarded to `DueDateIndicator`
- Status `variant` and `priority` are forwarded to `Badge`
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Card"]`, `[data-component="UserChip"]`, `[data-component="DueDateIndicator"]`, `[data-component="Badge"]` resolve
- axe-core passes in default and activatable states
