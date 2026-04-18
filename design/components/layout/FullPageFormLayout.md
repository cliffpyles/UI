---
name: FullPageFormLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-entry]
uses: [Grid, Box, FormField, Button]
---

# FullPageFormLayout

> A full-page form scaffold with a single- or two-column body and a sticky action footer.

## Purpose
FullPageFormLayout owns the long-form data-entry frame: a titled header, a vertically-scrolling body of grouped `FormField`s, and a footer that stays visible so the primary action is always reachable. It supports a one-column reading flow for short forms and a two-column grid (form + contextual summary/help) for longer ones. Without it, every "create entity" page invents its own scroll behavior and footer placement.

## When to use
- Create / edit pages for a single record
- Settings pages with grouped form sections
- Onboarding screens that don't warrant a wizard

## When NOT to use
- Multi-step flows with per-step validation → use **MultiStepFormLayout**
- Modal-sized forms → use **Modal** with FormField children
- Tabular per-row edits → use **InlineEditLayout**

## Composition (required)
| Concern         | Use                                                  | Never                              |
|-----------------|------------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for header/body/footer     | hand-rolled `display: grid`/`flex` |
| Two-column body | `Grid` with named tracks `form` + `aside` (optional) | hand-rolled `display: grid`        |
| Field stack     | `Box direction="column" gap>`                        | hand-rolled flex                   |
| Each field      | `FormField`                                          | raw `<label>`/`<input>`            |
| Footer actions  | `Button` (primary + secondary + cancel)              | raw `<button>`                     |

## API contract
```ts
interface FullPageFormLayoutProps extends HTMLAttributes<HTMLFormElement> {
  title: ReactNode;
  description?: ReactNode;
  variant?: "single" | "two-column";        // two-column only when `aside` provided
  aside?: ReactNode;                        // contextual help/summary slot
  primaryAction: { label: string; onClick: () => void; loading?: boolean; disabled?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
  cancelAction?: { label: string; onClick: () => void };
  children: ReactNode;                      // FormField children
}
```
Renders a `<form>` root and forwards ref to it.

## Required states
| State    | Behavior                                                                     |
|----------|------------------------------------------------------------------------------|
| default  | Header, body, sticky footer; primary action enabled when valid               |
| invalid  | Primary action disabled; first invalid field receives focus on submit        |
| saving   | Primary `Button` shows `loading`; root has `aria-busy="true"`                |
| two-col  | When `variant="two-column"` and `aside` truthy, `Grid` renders the aside     |

## Accessibility
- Root is a `<form>` inside a `<main>` landmark; the title is the accessible name
- Footer is `role="region" aria-label="Form actions"` with `position: sticky` (token-driven)
- Submitting the form invokes `primaryAction.onClick`; Enter inside fields submits
- Focus returns to the first invalid field on validation failure

## Tokens
- Inherits all tokens from `Grid`, `Box`, `FormField`, `Button`
- Adds (component tier): `--full-form-header-gap`, `--full-form-footer-padding`, `--full-form-aside-width`

## Do / Don't
```tsx
// DO
<FullPageFormLayout
  title="New project"
  primaryAction={{ label: "Create", onClick: submit, loading: saving }}
  cancelAction={{ label: "Cancel", onClick: back }}
>
  <FormField label="Name"><Input value={name} onChange={…}/></FormField>
  <FormField label="Owner"><Select …/></FormField>
</FullPageFormLayout>

// DON'T — own the footer markup
<div style={{ position: "sticky", bottom: 0 }}>…</div>

// DON'T — raw form controls
<input name="name" />
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
- Submitting the form invokes `primaryAction.onClick`
- `saving` sets `aria-busy` and shows the primary `Button` loading state
- `variant="two-column"` with `aside` renders the `Grid` aside track
- Cancel and secondary actions render only when provided
- Forwards ref; spreads remaining props onto root
- Composition probe: `FormField`, `Button`, and (when two-column) `Grid` render inside output
- axe-core passes in default, saving, two-column
