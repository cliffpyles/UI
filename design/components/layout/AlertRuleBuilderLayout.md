---
name: AlertRuleBuilderLayout
tier: layout
level: 6
status: stable
since: 0.7.0
uses: [Box, FormField, Card, Button]
---

# AlertRuleBuilderLayout

> A page frame for assembling an alert rule from conditions, thresholds, evaluation cadence, and notification targets.

## Purpose
AlertRuleBuilderLayout owns the multi-section rule authoring page: condition builder, evaluation window, severity, and notification routing — each grouped in `Card` sections, each field rendered through `FormField`, with a sticky footer of `Button` actions. It centralizes the structure so every monitoring product produces consistent, accessible rule pages without reinventing the section grouping.

## When to use
- Authoring or editing an alert rule
- Building threshold rules for metrics or logs
- Configuring notification routing for an existing rule

## When NOT to use
- Acknowledging or resolving live alerts → use **AlertFeedLayout**
- Investigating one fired alert → use **IncidentDetailLayout**
- Search-driven log triage → use **LogExplorerLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for header/body/footer   | hand-rolled `display: grid`/`flex` |
| Section group   | `Card` per section (Condition, Window, Routing)    | raw `<div>` with border CSS        |
| Section body    | `Box direction="column" gap>` of `FormField`s      | hand-rolled flex                   |
| Each field      | `FormField`                                        | raw `<label>`/`<input>`            |
| Footer actions  | `Button` (save, test, cancel)                      | raw `<button>`                     |

## API contract
```ts
interface AlertRuleBuilderLayoutProps extends HTMLAttributes<HTMLFormElement> {
  rule: AlertRuleDraft;
  onChange: (next: AlertRuleDraft) => void;
  onSave: () => void | Promise<void>;
  onTest?: () => void | Promise<void>;
  onCancel?: () => void;
  saving?: boolean;
  testing?: boolean;
  preview?: ReactNode;                       // optional rule preview slot
}
```
Renders a `<form>` root and forwards ref to it.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | All sections render in order; save enabled when rule is valid             |
| invalid  | Save disabled; offending `FormField` shows error                          |
| saving   | Save `Button` shows `loading`; root has `aria-busy="true"`                |
| testing  | Test `Button` shows `loading`; preview slot displays test output          |
| preview  | When `preview` is provided, it renders inside a `Card` below the sections |

## Accessibility
- Root is a `<form>` inside a `<main>` landmark with `aria-label="Alert rule"`
- Each `Card` section uses a heading rendered via `Text` so screen readers can navigate
- Save shortcuts (Cmd/Ctrl+S) trigger `onSave` only when valid
- Field-level errors surface via `FormField`'s `role="alert"`

## Tokens
- Inherits all tokens from `Box`, `FormField`, `Card`, `Button`
- Adds (component tier): `--alert-rule-section-gap`, `--alert-rule-footer-padding`

## Do / Don't
```tsx
// DO
<AlertRuleBuilderLayout
  rule={draft}
  onChange={setDraft}
  onSave={save}
  onTest={runTest}
/>

// DON'T — own the section card markup
<div className="section">…</div>

// DON'T — raw form controls
<select value={severity} onChange={…} />
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
- All declared sections render as `Card`s
- Save invokes `onSave`; disabled while invalid or while `saving`
- `testing` shows loading on the test `Button`
- `preview` slot renders inside a `Card` when provided
- Forwards ref; spreads remaining props onto root
- Composition probe: `Card`, `FormField`, `Button` render inside output
- axe-core passes in default, invalid, saving, testing
