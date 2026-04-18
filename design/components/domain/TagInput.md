---
name: TagInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Input, Tag, Button, Popover]
---

# TagInput

> A multi-value entry that shows selected values as removable tags and offers autocomplete with optional creation of new values.

## Purpose
TagInput owns the multi-value entry pattern that comes up in every product: keywords, labels, recipients, allowed domains. It composes `Tag` for each value, `Input` for the typing area, and a `Popover` of suggestions. It standardizes the keyboard model (Enter / comma to commit, Backspace to remove the last tag) and the create-new-value affordance, so product surfaces stop reinventing them inconsistently.

## When to use
- Multi-value fields where each value is a short string (tags, labels, emails)
- Inputs where the user may pick from a list and/or create new values
- Filter pickers that aggregate selected values inline

## When NOT to use
- Single-value selection from a list → use **Select**
- Hierarchical category selection → use **CategoryPicker**
- Long-text entry → use **Textarea**
- File or attachment lists → out of scope (use a dedicated uploader)

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" gap` wrapping tags + input | hand-rolled flex / padding in CSS |
| Selected values | `Tag` (one per value, with `onRemove`) | raw styled `<span>` chips         |
| Typing area     | `Input` (no border; sits inside the tag row) | raw `<input>`                  |
| Suggestions     | `Popover`                            | bespoke floating div                 |
| "Create" affordance | `Button variant="ghost"` inside the popover | raw `<button>`                |

## API contract
```ts
interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string[];
  onChange: (next: string[]) => void;
  suggestions?: (query: string) => Promise<string[]> | string[];
  allowCreate?: boolean;                // default true
  validate?: (candidate: string) => string | null;   // returns error message or null
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                     |
|----------|------------------------------------------------------------------------------|
| empty    | Placeholder shown in `Input`; no tags                                         |
| typing   | `Popover` shows suggestions; `allowCreate` adds a "Create '<query>'" row     |
| selected | One `Tag` per value; Backspace from empty input removes the last tag         |
| invalid  | `validate` returning a message blocks commit and shows the error via `Text`  |
| max-reached | `Input` disabled; helper text explains the cap                            |
| disabled | Input + tag remove buttons disabled                                          |

## Accessibility
- Root container is `role="group"` with an accessible name from `aria-label` / labeling FormField
- `Input` exposes `aria-autocomplete="list"` and `aria-activedescendant` for the active suggestion
- Each `Tag` remove button has `aria-label="Remove <value>"`
- Backspace-to-remove is announced via the live region built into `Tag`'s removal flow

## Tokens
- Inherits all tokens from `Input`, `Tag`, `Button`, `Popover`
- Adds (component tier): `--tag-input-row-gap`, `--tag-input-row-padding`

## Do / Don't
```tsx
// DO
<TagInput value={tags} onChange={setTags} suggestions={fetchTags} />

// DON'T — render chips as styled spans
{tags.map(t => <span className="chip">{t}</span>)}

// DON'T — handle Enter on a raw input
<input onKeyDown={e => e.key === "Enter" && commit()} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Enter and comma commit the typed value as a new tag
- Backspace from empty input removes the last tag
- Selecting a suggestion adds it to value
- `allowCreate=false` suppresses the "Create" affordance
- `validate` failure blocks commit and renders the error
- `maxTags` disables further entry
- Forwards ref; spreads remaining props onto root
- Composition probe: `Input`, `Tag`, `Popover`, `Button` all render inside output
- axe-core passes in default, with-tags, suggestions-open, disabled
