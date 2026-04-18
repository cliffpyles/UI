---
name: VersionHistory
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Button, Text, Timestamp, Modal]
---

# VersionHistory

> A list of prior versions of an entity with author, timestamp, and actions to view, restore, or compare.

## Purpose
VersionHistory standardizes the "previous versions" panel that appears in docs, dashboards, queries, and configurations. It owns the row layout (label + author + timestamp + actions), the restore confirmation modal, and the compare action's selection model — so every product surface that exposes versioning behaves identically. It does not own version data fetching or diff rendering.

## When to use
- Detail pages or drawers that need to expose prior revisions
- Settings pages where users may revert to a previous configuration
- Authoring surfaces with revision history

## When NOT to use
- Field-level diffs of a single change → use **ChangeLog**
- Activity timelines without restore actions → use **ActivityFeed**
- Audit / security log → use **AuditEntry** rows

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for the list; `Box direction="row" align="center" gap` per row | hand-rolled flex / padding in CSS |
| Row actions     | `Button variant="ghost" size="sm"`   | raw `<button>`                       |
| Version label / author | `Text`                        | raw styled `<span>`                  |
| Timestamp       | `Timestamp`                          | inline date formatting               |
| Restore confirmation | `Modal`                         | bespoke confirm dialog               |

## API contract
```ts
interface VersionRecord {
  id: string;
  label?: string;                       // e.g. "v12" or "Auto-saved"
  author: { id: string; name: string };
  createdAt: Date | string;
  isCurrent?: boolean;
}

interface VersionHistoryProps extends HTMLAttributes<HTMLElement> {
  versions: VersionRecord[];
  onView?: (id: string) => void;
  onRestore?: (id: string) => void | Promise<void>;
  onCompare?: (a: string, b: string) => void;
  loading?: boolean;
}
```
Renders as `<section>`; forwards ref to it.

## Required states
| State    | Behavior                                                                 |
|----------|--------------------------------------------------------------------------|
| empty    | "No previous versions" rendered via `Text color="secondary"`             |
| default  | One row per version with label, author, `Timestamp`, action `Button`s    |
| current  | Row marked with a textual "Current" badge; restore disabled              |
| compare-selecting | When two versions are selected, a `Button` "Compare selected" appears | 
| restoring| Confirm `Modal` open; primary action disabled while pending              |
| loading  | Skeleton rows; `aria-busy="true"` on root                                |

## Accessibility
- Root `<section>` with `aria-label="Version history"`
- Compare selection uses checkboxes-or-toggles with proper accessible names ("Select <label> for compare")
- The restore confirmation `Modal` has a clear destructive description and a labeled primary button
- Current version is conveyed in text, not color alone

## Tokens
- Inherits all tokens from `Button`, `Text`, `Timestamp`, `Modal`
- Adds (component tier): `--version-history-row-gap`, `--version-history-row-padding`

## Do / Don't
```tsx
// DO
<VersionHistory versions={versions} onView={view} onRestore={restore} onCompare={diff} />

// DON'T — bake in confirmation UI
window.confirm("Restore this version?")

// DON'T — render the time as a string
<span>{new Date(v.createdAt).toLocaleString()}</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `Timestamp`)
- Inline trend glyphs (▲▼↑↓)
- `window.confirm` / `window.alert`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Empty `versions` renders the empty `Text`
- Each row renders label / author / `Timestamp` and action `Button`s
- `isCurrent` row disables restore and shows "Current" text
- Selecting two rows shows the "Compare selected" affordance and invokes `onCompare(a, b)`
- Restore opens the `Modal`; confirming invokes `onRestore(id)`
- `loading` shows skeletons and sets `aria-busy`
- Forwards ref; spreads remaining props onto root `<section>`
- Composition probe: `Button`, `Timestamp`, `Modal` all render inside output
- axe-core passes in empty, default, restoring, loading
