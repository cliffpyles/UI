---
name: WizardFrame
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Text, ProgressBar, Button]
replaces-raw: []
---

# WizardFrame

> A linear, step-by-step task frame with progress indication and persistent next/back navigation.

## Purpose
WizardFrame is the standard layout for any multi-step task — onboarding, setup, guided creation, configuration flows. It owns the step header, progress visualization, body region, and the always-visible navigation footer so each wizard in the product behaves identically and exposes consistent keyboard handling and accessibility.

## When to use
- Multi-step onboarding or setup flow with a clear linear order
- Guided creation of a complex entity that benefits from chunking
- Any task where the user needs to know "where am I and how much is left"

## When NOT to use
- Branching, non-linear flows → use a routed sequence with explicit navigation
- A single-form task → use a `Modal` or a regular form page
- A free exploration surface → use **MultiPanelWorkspace**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Box direction="column">`                    | hand-rolled flex CSS                   |
| Step title           | `Text as="h1" size="xl" weight="semibold">`  | raw `<h1>` with typography CSS         |
| Step description     | `Text as="p" color="secondary">`             | raw `<p>` with typography CSS          |
| Progress display     | `ProgressBar>` (with step counter)           | raw `<progress>` or hand-rolled bars   |
| Body region          | `Box direction="column" gap>`                | raw `<div>` with overflow CSS          |
| Footer navigation row| `Box direction="row" justify="between">`     | hand-rolled flex CSS                   |
| Back / Next controls | `Button>`                                    | raw `<button>`                         |

## API contract
```ts
interface WizardStepMeta {
  id: string;
  title: ReactNode;
  description?: ReactNode;
}

interface WizardFrameProps extends HTMLAttributes<HTMLDivElement> {
  steps: WizardStepMeta[];
  currentStep: number;             // 0-based
  onBack?: () => void;
  onNext: () => void;
  onCancel?: () => void;
  nextLabel?: ReactNode;           // default "Next"
  backLabel?: ReactNode;           // default "Back"
  nextDisabled?: boolean;
  loading?: boolean;
  children: ReactNode;             // step body
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | Header, progress, body, footer rendered                               |
| first-step      | Back button hidden or disabled                                        |
| last-step       | Next button label switches to "Finish" (caller-controlled via prop)   |
| loading         | Next button enters loading state via `Button loading`                 |
| next-disabled   | Next button disabled (e.g. invalid form)                              |
| no-cancel       | Cancel control omitted entirely                                       |

## Accessibility
- Root carries `role="region"` with `aria-label="Wizard"`
- `ProgressBar` exposes `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Step heading is the labelled-by target for the body region
- Focus moves to the step heading on each step change
- Back/Next/Cancel are real `Button`s with explicit labels

## Tokens
- Inherits all tokens from `Box`, `Text`, `ProgressBar`, `Button`
- Adds (component tier): `--wizard-frame-content-max-width`, `--wizard-frame-section-gap`

## Do / Don't
```tsx
// DO
<WizardFrame
  steps={steps}
  currentStep={i}
  onBack={prev}
  onNext={next}
  nextDisabled={!form.valid}
  loading={submitting}
>
  <StepBody/>
</WizardFrame>

// DON'T — render the title with a raw heading
<h1>Step 2</h1>

// DON'T — build progress with hand-rolled segments
<div className="bar"><span style={{ width: "40%" }}/></div>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `WizardFrame.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders title, description, progress, body, and footer
- Back hidden/disabled at first step; Next reflects `nextDisabled` and `loading`
- Clicking Next/Back invokes the corresponding handler
- `ProgressBar` reflects `currentStep / steps.length`
- Focus moves to step heading on `currentStep` change
- Composition probes: `ProgressBar`, `Button`, `Text` all resolve in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes on first, middle, last step
