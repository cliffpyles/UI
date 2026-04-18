---
name: MultiStepFormLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-entry]
uses: [Box, WizardFrame, FormField, Button]
---

# MultiStepFormLayout

> A wizard-style form frame that splits a long flow into validated steps with stable navigation.

## Purpose
MultiStepFormLayout owns the step-at-a-time entry pattern used for setup, onboarding, and complex resource creation. It pairs `WizardFrame` (which owns step indicator and history) with per-step `FormField` bodies, and centralizes Next/Back/Submit behavior so each step only declares its fields and validator. Without it, every wizard reinvents step state and skips half the keyboard semantics.

## When to use
- Multi-step onboarding or setup
- Resource creation that needs per-step validation
- Flows where steps depend on prior answers

## When NOT to use
- Short forms (≤ ~10 fields) → use **FullPageFormLayout**
- Modal-sized confirmations → use **Modal**
- Tabbed forms with no order dependency → use **Tabs**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for header/body/footer   | hand-rolled `display: grid`/`flex` |
| Step indicator  | `WizardFrame` (peer layout)                        | inline step pills                  |
| Step body       | `Box direction="column" gap>` of `FormField`s      | hand-rolled flex                   |
| Each field      | `FormField`                                        | raw `<label>`/`<input>`            |
| Footer actions  | `Button` (back, next, submit)                      | raw `<button>`                     |

## API contract
```ts
interface MultiStepFormLayoutProps extends HTMLAttributes<HTMLFormElement> {
  steps: { id: string; label: string; render: () => ReactNode; validate?: () => boolean | Promise<boolean> }[];
  currentStepId: string;
  onStepChange: (id: string) => void;
  onSubmit: () => void | Promise<void>;
  submitting?: boolean;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
}
```
Renders a `<form>` root and forwards ref to it.

## Required states
| State      | Behavior                                                                  |
|------------|---------------------------------------------------------------------------|
| default    | Active step's body renders; `WizardFrame` highlights current step         |
| invalid    | `validate` returning false blocks Next; first invalid `FormField` focuses |
| submitting | Submit `Button` shows `loading`; root has `aria-busy="true"`              |
| terminal   | On the last step, Next becomes Submit                                     |
| firstStep  | Back `Button` is hidden or disabled                                       |

## Accessibility
- Root is a `<form>` inside a `<main>` landmark
- `WizardFrame` exposes `aria-current="step"` on the active indicator
- Step transitions move focus to the new step's first interactive control
- Submit fires only on terminal step; Enter on any field advances when valid

## Tokens
- Inherits all tokens from `Box`, `WizardFrame`, `FormField`, `Button`
- Adds (component tier): `--multi-step-form-body-gap`, `--multi-step-form-footer-padding`

## Do / Don't
```tsx
// DO
<MultiStepFormLayout
  steps={[
    { id: "info", label: "Info", render: () => <FormField label="Name"><Input/></FormField>, validate: () => name.length > 0 },
    { id: "review", label: "Review", render: () => <ReviewSummary/> },
  ]}
  currentStepId={step}
  onStepChange={setStep}
  onSubmit={create}
/>

// DON'T — own the step indicator
<div className="steps">{steps.map(s => <div className={s.id===cur?'active':''}/>)}</div>

// DON'T — raw form controls inside a step
<input name="email" />
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
- Current step's body renders; others do not
- Next blocked when `validate` returns false; first invalid field focuses
- Last step swaps Next for Submit; submit invokes `onSubmit`
- `submitting` shows loading state and sets `aria-busy`
- Back is hidden/disabled on the first step
- Forwards ref; spreads remaining props onto root
- Composition probe: `WizardFrame`, `FormField`, `Button` render inside output
- axe-core passes in default, invalid, submitting, terminal
