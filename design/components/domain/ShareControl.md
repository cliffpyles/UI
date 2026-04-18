---
name: ShareControl
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Button, Icon]
replaces-raw: []
---

# ShareControl

> An inline trigger that opens a share dialog for the current record.

## Purpose
ShareControl is the canonical "Share" button for any shareable resource. It owns the visual treatment, label, and trigger semantics so that every "share this record" entry point in the product looks the same and emits a consistent event for opening the share dialog.

## When to use
- A detail panel header needs a share entry point
- A row toolbar needs an inline share button
- Any place the user expects to invite collaborators or copy a link

## When NOT to use
- The actual share dialog body → that's a separate `ShareDialog` (composes Modal)
- A scope indicator (private/team/public) → use **VisibilityBadge**
- An access status mark → use **AccessIndicator**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box display="inline-flex" align="center">` | hand-rolled inline-flex CSS |
| Trigger         | `Button variant="secondary" size="sm">` (or `ghost` per `appearance`) | raw `<button>` |
| Leading icon    | `Icon name="share">`               | inline `<svg>`                     |

## API contract
```ts
type ShareAppearance = "default" | "ghost" | "icon";

interface ShareControlProps extends HTMLAttributes<HTMLDivElement> {
  appearance?: ShareAppearance;       // default "default"
  label?: ReactNode;                  // default "Share"
  onOpen: () => void;                 // open the share dialog
  disabled?: boolean;
  count?: number;                     // optional number of current collaborators
}
```
Component uses `forwardRef<HTMLDivElement, ShareControlProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| default      | Secondary `Button` with leading share `Icon` and label            |
| ghost        | Ghost `Button` variant for use in toolbars                        |
| icon         | Icon-only `Button` with `aria-label="Share"`                      |
| with count   | Optional trailing badge with collaborator count (rendered inside `Button` slot) |
| disabled     | Button non-interactive                                            |

## Accessibility
- Icon-only appearance MUST set an `aria-label` (defaulted to "Share").
- The control announces an action, not a state change; use `<button>` semantics via `Button` (no `aria-pressed`).
- When `count` is shown, it is included in the accessible name (e.g. "Share, 4 collaborators").

## Tokens
- Inherits all tokens from `Button` (no new tokens here)

## Do / Don't
```tsx
// DO
<ShareControl onOpen={openShareDialog} />
<ShareControl appearance="icon" onOpen={openShareDialog} />
<ShareControl onOpen={openShareDialog} count={4} />

// DON'T — own the dialog here
<ShareControl><ShareDialog open .../></ShareControl>

// DON'T — bare anchor styled as button
<a href="#share" className="btn">Share</a>
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
- Click fires `onOpen`
- `appearance="icon"` renders icon-only and exposes `aria-label`
- `count` is included in the accessible name
- `disabled` blocks click
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Button"]` and `[data-component="Icon"]` resolve
- axe-core passes in each appearance
