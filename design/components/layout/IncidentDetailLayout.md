---
name: IncidentDetailLayout
tier: layout
level: 6
status: stable
since: 0.7.0
uses: [Box, TimelineLayout, Card, Tabs, StatusBadge, AuditEntry]
---

# IncidentDetailLayout

> A full-page frame for a single incident, combining status, timeline, signals, and responder activity in a stable navigation shell.

## Purpose
IncidentDetailLayout owns the page shown when an on-call engineer opens one incident: a header summarizing severity and current `StatusBadge`, a `TimelineLayout` of state changes, `Tabs` to swap between signals / responders / postmortem, and an `AuditEntry`-driven activity stream. It standardizes the IR page across products so muscle memory transfers and accessibility is built in.

## When to use
- The detail page for one incident or paged event
- Postmortem authoring shell
- Any "single incident" workspace with timeline + sub-views

## When NOT to use
- Lists of multiple alerts → use **AlertFeedLayout**
- Authoring rules → use **AlertRuleBuilderLayout**
- Health overviews of many systems → use **StatusPageLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for header/body          | hand-rolled `display: grid`/`flex` |
| Status header   | `Box` containing `StatusBadge` + title `Text`      | inline colored markup              |
| Timeline        | `TimelineLayout` (peer layout)                     | inline ordered list                |
| Sub-views       | `Tabs` (Signals / Responders / Postmortem)         | hand-rolled tab pills              |
| Section surface | `Card` per content panel                           | raw `<div>` with border CSS        |
| Activity row    | `AuditEntry` per audit event                       | inline event JSX                   |

## API contract
```ts
interface IncidentDetailLayoutProps extends HTMLAttributes<HTMLDivElement> {
  incident: Incident;
  status: IncidentStatus;
  timeline: TimelineEntry[];
  audit: AuditEvent[];
  tabs: { id: string; label: string; render: () => ReactNode }[];
  currentTabId: string;
  onTabChange: (id: string) => void;
  actions?: ReactNode;                     // header action slot (resolve, page, escalate)
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | Header + timeline + active tab panel + audit stream                       |
| resolved | `StatusBadge` reflects resolved; timeline shows resolution entry          |
| empty    | Empty timeline → `TimelineLayout`'s empty state                           |
| loading  | Tabs panel renders skeleton; root has `aria-busy="true"`                  |

## Accessibility
- Root is a `<main>` landmark with the incident title as accessible name
- Tabs follow the WAI-ARIA tabs pattern (delegated to `Tabs`)
- Timeline entries are an ordered list with semantic time elements
- Status changes are announced via `aria-live="polite"` on the header

## Tokens
- Inherits all tokens from `Box`, `TimelineLayout`, `Card`, `Tabs`, `StatusBadge`, `AuditEntry`
- Adds (component tier): `--incident-detail-header-gap`, `--incident-detail-body-gap`

## Do / Don't
```tsx
// DO
<IncidentDetailLayout
  incident={inc}
  status={inc.status}
  timeline={inc.timeline}
  audit={inc.audit}
  tabs={[
    { id: "signals", label: "Signals", render: () => <SignalsPanel/> },
    { id: "responders", label: "Responders", render: () => <RespondersPanel/> },
  ]}
  currentTabId={tab}
  onTabChange={setTab}
/>

// DON'T — inline status pill
<span className="badge red">Firing</span>

// DON'T — own the tab markup
<div className="tabs"><div className="tab active">…</div></div>
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
- Header renders `StatusBadge` matching `status`
- Active tab's `render` output is the only one mounted
- Tab change invokes `onTabChange` with the new id
- `audit` events render as `AuditEntry` rows
- Forwards ref; spreads remaining props onto root
- Composition probe: `TimelineLayout`, `Tabs`, `Card`, `StatusBadge`, `AuditEntry` render inside output
- axe-core passes in default, resolved, loading
