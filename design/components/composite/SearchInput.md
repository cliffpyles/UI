---
name: SearchInput
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: [filtering-and-search, data-entry]
uses: [Input, Icon, Button, Spinner]
replaces-raw: ["<input type=\"search\">"]
---

# SearchInput

> A search-typed text field with a leading magnifier glyph, a clear affordance, and built-in debouncing.

## Purpose
SearchInput is the canonical "search this list" control. It owns the leading icon slot, the trailing clear button (visible only when there's a value), the debounced `onChange` for query-as-you-type, the Enter-to-submit affordance, and the loading spinner that replaces the icon while a search is in flight. The actual text field, focus ring, sizing, and disabled handling come from `Input` — SearchInput is the composition that turns an `Input` into a search field.

## When to use
- A search box above a list, table, or grid
- A filter bar where a free-text query narrows results
- Command-bar style entry points (with `onSearch` for Enter)

## When NOT to use
- A general text input — use **Input**
- A multi-select with searchable options — use a Combobox / multi-select
- A typeahead with rendered suggestions — wrap SearchInput in a Combobox component
- Submitting a form (use a real submit button, not Enter on SearchInput)

## Composition (required)
| Concern        | Use                                | Never                                  |
|----------------|------------------------------------|----------------------------------------|
| Text field     | `Input type="search">` (focus ring, sizing, disabled) | raw `<input type="search">` |
| Leading icon   | `Icon name="search">`              | inline `<svg>`                         |
| Loading swap   | `Spinner size="sm">` replaces the icon | hand-rolled CSS animation          |
| Clear button   | `Button variant="ghost" size="sm"` icon-only with `Icon name="x">` | raw `<button>` + inline `<svg>` |

The leading icon and clear button should attach to the `Input` via its `leadingIcon` / `trailingAdornment` slots if those exist; otherwise SearchInput composes a wrapper `Box` around `Input` and overlays adornments. Either way, no raw `<input>` markup inside SearchInput.

## API contract
```ts
type SearchInputSize = "sm" | "md" | "lg";

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "onChange"
> {
  value?: string;                        // controlled
  defaultValue?: string;                 // uncontrolled
  onChange?: (value: string) => void;    // debounced
  onSearch?: (value: string) => void;    // fires on Enter
  placeholder?: string;                  // default "Search..."
  debounce?: number;                     // ms, default 300
  loading?: boolean;
  size?: SearchInputSize;                // default "md"
}
```
`onChange` returns the value as a string (not the synthetic event), per the design system's value-not-event convention.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| empty        | Leading search `Icon`; no clear button; placeholder shown             |
| typing       | `onChange` fires after `debounce` ms of inactivity                    |
| has value    | Clear `Button` appears at trailing edge                               |
| loading      | Leading icon swaps to `Spinner size="sm">`                            |
| disabled     | `Input` disabled state; clear button hidden                           |
| Escape       | Clears the value and fires `onChange("")` immediately                 |
| Enter        | Cancels pending debounce and fires `onSearch(currentValue)`           |

## Accessibility
- Underlying `Input` provides label association (caller usually wraps in `FormField` or supplies `aria-label`).
- The clear `Button` has `aria-label="Clear search"`.
- The leading icon (and the loading spinner that replaces it) is `aria-hidden="true"` — the field's accessible name comes from its label.
- After clearing, focus returns to the input.

## Tokens
- Input chrome inherited from `Input` (border, radius, focus ring, sizing)
- Adornment spacing: `--search-input-icon-gap`
- No component-specific colors

## Do / Don't
```tsx
// DO
<FormField label="Search projects">
  <SearchInput
    value={query}
    onChange={setQuery}
    onSearch={runSearch}
    loading={isFetching}
  />
</FormField>

// DON'T — hand-rolled clear button
<input type="search"/>
<button onClick={clear}><svg>…</svg></button>

// DON'T — inline svg for the search glyph
<span><svg>…</svg></span><input type="search"/>
```

## Forbidden patterns (enforced)
- Raw `<input>` (use `Input`)
- Raw `<button>` for clear (use `Button`)
- Inline `<svg>` (use `Icon` / `Spinner`)
- Hand-rolled spinner (use `Spinner`)
- Hardcoded color, spacing, radius values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `onChange` fires after `debounce` ms; not on every keystroke
- `onSearch` fires immediately on Enter and cancels pending debounce
- Escape clears the value and fires `onChange("")`
- Clear `Button` appears only when value is non-empty
- `loading` swaps leading `Icon` for `Spinner`
- Forwards ref to the underlying input
- Composition probe: `Input` renders the field; `Icon` renders the search glyph; `Button` renders the clear control
- axe-core passes in empty, has-value, loading, disabled
