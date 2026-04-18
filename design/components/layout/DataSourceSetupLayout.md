---
name: DataSourceSetupLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [forms-and-input]
uses: [Box, WizardFrame, FormField, Button]
replaces-raw: []
---

# DataSourceSetupLayout

> The canonical four-step wizard for connecting a new data source: credentials, connection test, schema selection, sync configuration.

## Purpose
DataSourceSetupLayout encodes the universal "connect a new source" flow that recurs across integrations, warehouses, file uploads, and API keys. By owning the step sequence (credentials → test → schema → sync), the per-step landmark, and the navigation footer, every connector in the product reads identically and the user never has to relearn where the "Test connection" button lives. The layout is presentational over a `WizardFrame` — callers supply the per-step field content; the layout supplies the spine.

## When to use
- Adding a new database, warehouse, or SaaS source connection
- Importing a file or stream that requires credentials and schema mapping
- Any onboarding flow that needs an in-line connection test before proceeding

## When NOT to use
- A single-page settings form → use **FormField** in a regular layout
- A generic linear task with no test/schema phase → use **WizardFrame** directly
- Editing an existing source → use the source's settings page, not the setup wizard

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `WizardFrame` with the four canonical steps  | hand-rolled stepper + content grid            |
| Per-step content stack| `Box direction="column" gap>`                | hand-rolled flex CSS                          |
| Field rows            | `FormField` for every labelled input         | bare `Input` + sibling `<label>`              |
| Test / Continue / Back actions | `Button` (primary, secondary, ghost) | raw `<button>` with utility classes           |
| Footer action row     | `Box direction="row" justify="between">`     | hand-rolled flex CSS                          |

## API contract
```ts
type SetupStep = "credentials" | "test" | "schema" | "sync";

interface DataSourceSetupLayoutProps extends HTMLAttributes<HTMLDivElement> {
  step: SetupStep;                  // controlled current step
  onStepChange: (step: SetupStep) => void;
  onTest: () => Promise<{ ok: boolean; message?: string }>;
  onSubmit: () => void | Promise<void>;
  credentials: ReactNode;           // step 1 fields
  schema: ReactNode;                // step 3 picker
  sync: ReactNode;                  // step 4 config
  testResult?: { ok: boolean; message?: string } | null;
  submitting?: boolean;
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| credentials     | Step 1 active; "Continue" disabled until required fields valid        |
| test            | Step 2 active; "Test connection" runs `onTest`, surfaces `testResult` |
| test-failed     | Banner + "Back" enabled; "Continue" disabled                          |
| schema          | Step 3 active; selection populates a summary                          |
| sync            | Step 4 active; "Submit" triggers `onSubmit` + `submitting`            |
| submitting      | Submit button shows loading; prior steps locked                       |

## Accessibility
- Inherits `role="region"` and step-progress semantics from `WizardFrame`
- Each step heading is the labelled landmark for that step
- Test result messages use `aria-live="polite"` so async outcomes are announced
- Submit button reflects `aria-busy` while `submitting`

## Tokens
- Inherits frame tokens from `WizardFrame`
- Inherits field tokens from `FormField`
- Adds (component tier): `--data-source-setup-step-gap`, `--data-source-setup-test-banner-padding`

## Do / Don't
```tsx
// DO
<DataSourceSetupLayout
  step={step}
  onStepChange={setStep}
  onTest={testConnection}
  onSubmit={save}
  credentials={<>{/* FormField rows */}</>}
  schema={<SchemaTree/>}
  sync={<SyncOptions/>}
/>

// DON'T — assemble the wizard manually
<div className="wizard"><Steps/><div>{content}</div><div>{nav}</div></div>

// DON'T — bypass FormField for inputs
<input name="host" />

// DON'T — raw button for "Test connection"
<button onClick={runTest}>Test connection</button>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `DataSourceSetupLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `step` value renders the matching slot content
- "Continue" is disabled on credentials step until validity propagates
- `onTest` is invoked on test action; success enables "Continue"
- Failed `testResult` surfaces error and blocks progression
- Submit invokes `onSubmit`; `submitting` disables prior-step navigation
- Composition probes: `WizardFrame` is the root frame; `FormField` resolves inside credentials slot; `Button` renders nav actions
- Forwards ref; spreads remaining props onto root
- axe-core passes on each step
