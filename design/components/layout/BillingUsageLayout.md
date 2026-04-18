---
name: BillingUsageLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, Card, ProgressPill, Button]
replaces-raw: []
---

# BillingUsageLayout

> A multi-zone admin surface showing the current plan, metered usage, recent invoices, and an upgrade affordance.

## Purpose
Billing screens combine four distinct zones — plan summary, usage meters, invoice history, and the upgrade CTA — into one page. BillingUsageLayout owns the responsive grid that places these zones consistently across viewports and ensures every meter renders through `ProgressPill` rather than bespoke bars.

## When to use
- A self-service billing & usage admin page
- Surfaces that combine plan info, metered limits, invoice history, and an upgrade flow
- Any account-level "you are using X of Y" overview

## When NOT to use
- A single usage meter on another page → use `ProgressPill` directly
- A pricing/marketing page (pre-purchase) → use a marketing pattern, not this layout
- An invoice list with no plan/usage context → use **DataTable**

## Composition (required)
| Concern              | Use                                                | Never                                  |
|----------------------|----------------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with named tracks `plan`/`usage`/`invoices`/`upgrade` | hand-rolled `display: grid` in CSS |
| Zone surface         | `Card`                                             | raw `<div>` with border CSS            |
| Inner zone stacks    | `Box direction="column" gap>`                      | hand-rolled flex CSS                   |
| Header / footer rows | `Box direction="row" align="center" justify="between" gap>` | hand-rolled flex CSS          |
| Usage meter          | `ProgressPill`                                     | bespoke progress bar                   |
| Upgrade / manage CTA | `Button`                                           | raw `<button>`                         |

## API contract
```ts
interface PlanSummary {
  name: string;
  tier: string;
  renewsAt?: string | null;
}

interface UsageMeter {
  id: string;
  label: string;
  used: number;
  limit: number | null;               // null → unmetered
  unit?: string;
}

interface BillingUsageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  plan: PlanSummary;
  meters: UsageMeter[];
  invoices: ReactNode;                // typically a DataTable supplied by caller
  onUpgrade?: () => void;
  onManagePlan?: () => void;
  loading?: boolean;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Plan, usage, invoices, and upgrade zones rendered                     |
| no-upgrade   | When `onUpgrade` omitted, upgrade zone collapses                      |
| no-meters    | When `meters.length === 0`, usage zone hides                          |
| loading      | Each zone surfaces its own loading affordance via the components used |

## Accessibility
- Each zone is wrapped in a `Card` with an `aria-labelledby` pointing to its heading
- `ProgressPill` provides `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label`
- Upgrade and Manage Plan controls render as `Button` with descriptive accessible names

## Tokens
- Inherits all surface tokens from `Box`, `Grid`, `Card`, `ProgressPill`, `Button`
- Adds (component tier): `--billing-usage-zone-gap`, `--billing-usage-meter-gap`

## Do / Don't
```tsx
// DO
<BillingUsageLayout
  plan={plan}
  meters={meters}
  invoices={<InvoicesTable rows={invoices}/>}
  onUpgrade={openUpgrade}
  onManagePlan={openPortal}
/>

// DON'T — bespoke usage bar
<div className="bar"><div className="fill" style={{ width: pct + "%" }}/></div>

// DON'T — hand-roll the four-zone grid
<div style={{ display: "grid" }}>…</div>

// DON'T — inline number formatting in meter labels
{(used).toLocaleString()} / {(limit).toLocaleString()}
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `BillingUsageLayout.css` (use `Grid` and `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (caller must format via shared utilities)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders plan, usage, invoices, and upgrade zones in the default state
- `onUpgrade` invoked when the upgrade CTA is activated
- Each meter renders a `ProgressPill` reflecting `used`/`limit`
- Composition probes: `Grid` at root; `Card` per zone; `ProgressPill` per meter; `Button` in CTA slot
- Forwards ref; spreads remaining props onto root
- axe-core passes for default and loading states
