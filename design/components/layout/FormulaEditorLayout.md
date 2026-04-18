---
name: FormulaEditorLayout
tier: layout
level: 6
status: stable
since: 0.7.0
uses: [Grid, Box, FormulaInput, Card]
---

# FormulaEditorLayout

> A two-pane editor frame pairing a formula input with a live preview, autocomplete reference, and validation panel.

## Purpose
FormulaEditorLayout owns the page frame for spreadsheet-style or expression-language editing — calculated columns, alert thresholds, computed metrics. It places `FormulaInput` (which owns syntax highlighting and autocomplete) on the left and a `Card`-wrapped preview/reference panel on the right, so authors can write and verify in one viewport. Without it, every formula surface invents its own pane split and preview cadence.

## When to use
- Building calculated fields, formulas, or expressions
- Editing alert conditions or query expressions
- Anywhere syntax-aware input needs a paired live result

## When NOT to use
- Free-text input with no expression grammar → use **Textarea** in **FormField**
- Full code editing across many files → out of scope (this is a single-expression frame)
- Inline cell editing in a table → use **InlineEditLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Grid` with named tracks `editor` + `preview`      | hand-rolled `display: grid`        |
| Pane stacks     | `Box direction="column" gap>` per pane             | hand-rolled flex                   |
| Expression input| `FormulaInput`                                     | raw `<textarea>` or contenteditable|
| Preview surface | `Card`                                             | raw `<div>` with border CSS        |
| Reference list  | `Box` of `Card`-grouped help entries               | inline tooltip-only docs           |

## API contract
```ts
interface FormulaEditorLayoutProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (next: string) => void;
  schema: FormulaSchema;                   // functions + variables for autocomplete
  preview?: { result: unknown; error?: string };
  reference?: ReactNode;                   // optional docs slot
  toolbar?: ReactNode;                     // optional pane header (save / format)
  collapsedPreview?: boolean;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | Two-pane `Grid`; live preview updates as `value` changes                  |
| invalid  | `preview.error` renders inside the preview `Card` with error styling      |
| empty    | Empty value shows reference panel guidance in the preview `Card`          |
| collapsed| `collapsedPreview` collapses the preview track; editor takes full width   |

## Accessibility
- Root is a `<section>` landmark with `aria-label="Formula editor"`
- Editor and preview panes are labeled regions (`aria-label="Editor"`, `aria-label="Preview"`)
- Preview updates are announced via `aria-live="polite"` so error/result changes reach screen readers
- Reference list uses real headings inside `Card`s for navigation

## Tokens
- Inherits all tokens from `Grid`, `Box`, `FormulaInput`, `Card`
- Adds (component tier): `--formula-editor-pane-gap`, `--formula-editor-preview-min-width`

## Do / Don't
```tsx
// DO
<FormulaEditorLayout
  value={expr}
  onChange={setExpr}
  schema={schema}
  preview={{ result: evaluated, error: err }}
  reference={<FunctionDocs />}
/>

// DON'T — own the editor markup
<textarea value={expr} onChange={…} />

// DON'T — preview without a Card surface
<div className="preview">{result}</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hand-rolled `display: grid` / `display: flex` in this component's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Typing in `FormulaInput` calls `onChange`
- `preview.error` renders inside the preview `Card` and is announced via `aria-live`
- `collapsedPreview` removes the preview track
- `reference` slot renders when provided, hidden otherwise
- Forwards ref; spreads remaining props onto root
- Composition probe: `Grid`, `FormulaInput`, `Card` all render inside output
- axe-core passes in default, invalid, collapsed
