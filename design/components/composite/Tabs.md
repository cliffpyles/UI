---
name: Tabs
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: [navigation-and-hierarchy]
uses: [Box, Text, Button]
replaces-raw: ["<div role=\"tablist\">", "<button role=\"tab\">"]
---

# Tabs

> A horizontal set of triggers that switch between mutually exclusive panels of content.

## Purpose
Tabs splits a single region of the page into multiple views the user can swap between without navigating away. It owns the controlled/uncontrolled selection state, the `tablist`/`tab`/`tabpanel` ARIA wiring, the roving tabindex, and the keyboard model (Arrow keys move selection, Home/End jump). Compound sub-components (`Tabs.List`, `Tabs.Tab`, `Tabs.Panel`) keep the API explicit while sharing state via context.

## When to use
- Switching between related views of the same entity (Overview / Activity / Settings)
- Filtering a list by category when the categories are stable and few
- Presenting a small number of tool panels where only one is relevant at a time

## When NOT to use
- Top-level page navigation — use a sidebar or nav bar
- More than ~7 tabs — use a sidebar or **Select** instead
- Tabs whose content is independently scrollable like documents — consider routes
- A single binary choice — use **Toggle** or radio group

## Composition (required)
| Concern         | Use                                            | Never                                          |
|-----------------|------------------------------------------------|------------------------------------------------|
| Root layout     | `Box display="flex" direction="column">`       | raw `<div>` with flex CSS                      |
| Tablist layout  | `Box display="flex" align="center">`           | hand-rolled flex CSS                           |
| Tab trigger     | `Button variant="tab">` (or `Button` with tab styles) | raw `<button>` with manual focus styles |
| Tab label       | `Text>` (rendered inside the tab Button)        | inline-styled `<span>` for the label           |
| Active indicator | CSS pseudo-element on tab Button driven by tokens | hand-rolled animated underline DOM elements |
| Panel container | `Box>`                                         | raw `<div>` with padding CSS                   |

The tab trigger is the most likely place this composition is bypassed today. The ideal implementation uses `Button` (which already owns focus ring, hit target, hover/active tokens) with a `variant="tab"` extension or an internal style hook, rather than a bare `<button>`.

## API contract
```ts
interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;                  // controlled
  defaultValue?: string;           // uncontrolled
  onChange?: (value: string) => void;
  children: ReactNode;             // <Tabs.List> + <Tabs.Panel>s
}

type TabsListProps = HTMLAttributes<HTMLDivElement>;

interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

// Compound: Tabs.List, Tabs.Tab, Tabs.Panel
```

## Required states
| State           | Behavior                                                                  |
|-----------------|---------------------------------------------------------------------------|
| default         | First tab (or `defaultValue`) selected; its panel rendered                |
| selected        | Selected `Tab` has `aria-selected="true"`, `tabIndex={0}`, active token   |
| unselected      | `aria-selected="false"`, `tabIndex={-1}`, inactive token                  |
| disabled        | `disabled` attribute on the tab Button; skipped by arrow-key navigation   |
| controlled      | `value` prop drives selection; `onChange` fires on user activation        |
| keyboard        | ArrowLeft/Right move selection; Home/End jump to first/last enabled tab   |

## Accessibility
- `Tabs.List` has `role="tablist"`; each `Tabs.Tab` has `role="tab"`; each `Tabs.Panel` has `role="tabpanel"`.
- `aria-controls` on the tab points at the panel id; `aria-labelledby` on the panel points at the tab id.
- Roving tabindex: only the selected tab is in tab order; arrow keys move focus among tabs.
- Activation is automatic on focus change (per WAI-ARIA recommended pattern), unless `manualActivation` is added later.

## Tokens
- Tab text: inherits `Text` color tokens
- Active indicator: `--color-action-primary-bg`, `--tabs-indicator-thickness`
- Tab padding: `--tabs-tab-padding-{x|y}`
- Border bottom: `--color-border-default`
- Focus ring: inherited from `Button`

## Do / Don't
```tsx
// DO
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="activity">Activity</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">{…}</Tabs.Panel>
  <Tabs.Panel value="activity">{…}</Tabs.Panel>
</Tabs>

// DON'T — bare button without composition
<button role="tab" className="my-tab">Overview</button>

// DON'T — using Tabs for top-level navigation
<Tabs><Tabs.Tab value="/users">Users</Tabs.Tab>…</Tabs>   // use a nav

// DON'T — hand-rolled animated indicator div
<div className="tabs-underline" style={{ left: x, width: w }}/>
```

## Forbidden patterns (enforced)
- Raw `<button>` for the tab trigger (use `Button`)
- Raw styled `<span>` for the tab label (use `Text`)
- Hand-rolled flex CSS in stylesheet (use `Box`)
- Hardcoded color, spacing, radius, duration values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Selected tab has `aria-selected="true"` and `tabIndex={0}`; others are `-1`
- ArrowLeft/Right cycle among enabled tabs; Home/End jump
- Disabled tabs are skipped by keyboard navigation
- Only the active panel is rendered
- Controlled and uncontrolled modes both work; `onChange` fires on activation
- Composition probe: `Button` renders the trigger; `Box` is the tablist layout
- Forwards ref; spreads remaining props onto root
- axe-core passes
