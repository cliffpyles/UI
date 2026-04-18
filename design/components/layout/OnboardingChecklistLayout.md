---
name: OnboardingChecklistLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [states]
uses: [Box, Card, Checkbox, ProgressPill, Text]
replaces-raw: []
---

# OnboardingChecklistLayout

> A persistent panel of onboarding tasks with per-item completion state and an aggregate progress indicator.

## Purpose
OnboardingChecklistLayout is the surface that walks a new user through the handful of actions that make the product useful — invite a teammate, connect a source, name a workspace. By owning the list shape, the per-item Checkbox affordance, the aggregate progress, and the dismissal/minimize behavior, the layout keeps every feature team's onboarding additions consistent and lets product centrally tune what "done" feels like. The list is presentational; completion state is supplied by the caller.

## When to use
- A new-account dashboard where a small set of setup tasks remain
- A feature that has a multi-step adoption arc the user can resume across sessions
- Any place a user benefits from seeing "what's next" alongside their progress

## When NOT to use
- A linear, blocking setup → use **WizardFrame** or **DataSourceSetupLayout**
- A one-off banner reminder → use **BannerAlert**
- An empty first-run page → use **EmptyStateScaffoldLayout**

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Card` as the panel surface                  | raw `<div>` with border CSS                   |
| Header row            | `Box direction="row" align="center" justify="between">` | hand-rolled flex CSS              |
| Header label          | `Text as="h2" size="md" weight="semibold">`  | raw `<h2>` with typography CSS                |
| Aggregate progress    | `ProgressPill` (count + bar)                 | hand-rolled "X of Y" text + bar               |
| Item list             | `Box direction="column" gap>`                | hand-rolled flex CSS or `<ul>` styled list    |
| Per-item row          | `Box direction="row" align="start" gap>` containing `Checkbox` + `Text` | raw `<li>` with hand-rolled checkbox |
| Item title / hint     | `Text` (size sm/xs)                          | raw `<span>` / `<p>`                          |

## API contract
```ts
interface ChecklistItem {
  id: string;
  title: string;
  description?: ReactNode;
  done: boolean;
  action?: ReactNode;             // optional inline Button to start the task
}

interface OnboardingChecklistLayoutProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;                 // default "Get started"
  items: ChecklistItem[];
  onToggle?: (id: string, next: boolean) => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | All items rendered with their `done` Checkbox state                   |
| in-progress     | `ProgressPill` shows `n / total` and partial bar                      |
| complete        | `ProgressPill` reads `total / total`; panel may render a "done" cap   |
| collapsed       | When `collapsible`, header remains; list hidden via `aria-hidden`     |
| empty           | When `items` is empty, panel renders nothing                          |

## Accessibility
- Header is a level-appropriate heading via `Text as`
- Each row's `Checkbox` is the labelled control; the label text is associated via `htmlFor` / `aria-labelledby`
- Aggregate progress is announced through `ProgressPill`'s `aria-valuenow`/`aria-valuemax`
- Collapse toggle exposes `aria-expanded` and `aria-controls`

## Tokens
- Inherits surface tokens from `Card`, list tokens from `Box`
- Adds (component tier): `--onboarding-checklist-row-gap`, `--onboarding-checklist-panel-padding`, `--onboarding-checklist-divider-color`

## Do / Don't
```tsx
// DO
<OnboardingChecklistLayout
  items={items}
  onToggle={markDone}
  collapsible
/>

// DON'T — hand-roll a checkbox
<div className="check" onClick={…}/>

// DON'T — render progress as plain text
<span>{done} of {total} complete</span>

// DON'T — use a raw <ul> with hand-styled rows
<ul className="checklist">{items.map(i => <li>…</li>)}</ul>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `OnboardingChecklistLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `ProgressPill`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each item renders a `Checkbox` reflecting its `done` value
- Toggling a Checkbox calls `onToggle(id, next)`
- `ProgressPill` reflects the count of `done` items
- `collapsible` mode toggles list visibility and `aria-expanded`
- Empty `items` array renders nothing
- Composition probes: `Card` resolves at the root; `Checkbox` resolves per row; `ProgressPill` resolves in header
- Forwards ref; spreads remaining props onto root
- axe-core passes in default and collapsed states
