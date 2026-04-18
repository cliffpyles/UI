---
name: FormulaInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Textarea, Popover, Text, Icon]
---

# FormulaInput

> An expression editor with syntax hints, error markers, and contextual autocomplete for fields, functions, and operators.

## Purpose
FormulaInput gives spreadsheet-style users a familiar way to author derived values, filter expressions, or computed columns. It combines a multi-line `Textarea` for the expression, a `Popover` of suggestions surfaced by the autocomplete engine, and inline status messaging. It exists because plain `Input`/`Textarea` cannot express the "you're inside this function call" hint that makes formulas usable.

## When to use
- Computed column or derived metric definitions in analytics tools
- Filter or alert rule editors that accept expressions
- Any field whose value is an expression evaluated server-side

## When NOT to use
- Free-form notes or descriptions → use **Textarea**
- Single-token field selection → use **Select** or **CategoryPicker**
- Code authoring with file/project context → out of scope (use a dedicated code editor)

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for editor + status row | hand-rolled flex / padding in CSS |
| Expression area | `Textarea`                           | raw `<textarea>` or `contentEditable`|
| Suggestion list | `Popover` anchored to the caret      | bespoke floating div                 |
| Status / error  | `Text` with appropriate color        | raw styled `<span>`                  |
| Status icon     | `Icon`                               | inline `<svg>`                       |

## API contract
```ts
interface FormulaSuggestion {
  id: string;
  label: string;
  kind: "field" | "function" | "operator";
  detail?: string;
}

interface FormulaInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (next: string) => void;
  suggestions?: (query: string, caret: number) => FormulaSuggestion[];
  error?: { message: string; from?: number; to?: number } | null;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;                        // default 4
}
```
Forwards ref to the root `<div>`.

## Required states
| State        | Behavior                                                                   |
|--------------|----------------------------------------------------------------------------|
| empty        | Placeholder rendered in `Textarea`                                         |
| typing       | `Popover` opens with suggestions when `suggestions` returns results         |
| error        | `Text color="error"` shows `error.message`; `aria-invalid` on textarea     |
| valid        | A subtle "OK" `Icon` + `Text color="secondary"` in status row              |
| disabled     | Textarea disabled; popover suppressed                                      |

## Accessibility
- `Textarea` is the focus owner; suggestions use `aria-autocomplete="list"` and an `aria-activedescendant` pattern
- Error message uses `role="alert"` and is referenced by `aria-describedby`
- Suggestions can be navigated with ArrowUp/ArrowDown; Enter inserts; Esc closes
- All status states convey meaning via icon + text, not color alone

## Tokens
- Inherits all tokens from `Textarea`, `Popover`
- Adds (component tier): `--formula-input-status-gap`, `--formula-input-suggestion-row-padding`

## Do / Don't
```tsx
// DO
<FormulaInput value={expr} onChange={setExpr} suggestions={getSuggestions} error={parseError} />

// DON'T — render contentEditable
<div contentEditable onInput={…} />

// DON'T — bespoke floating suggestion box
<div style={{ position: "absolute" }}>…</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `<div contentEditable>` for the expression area
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Typing fires `onChange` and queries `suggestions`
- Selecting a suggestion via Enter inserts its label at the caret
- `error` sets `aria-invalid` and renders the message via `Text`
- Esc closes the popover without changing value
- Forwards ref; spreads remaining props onto root
- Composition probe: `Textarea`, `Popover`, `Icon` all render inside output
- axe-core passes in default, suggestions-open, error, disabled
