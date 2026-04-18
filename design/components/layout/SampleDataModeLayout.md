---
name: SampleDataModeLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [states]
uses: [Box, BannerAlert, Button]
replaces-raw: []
---

# SampleDataModeLayout

> A page-level wrapper that frames its content with a persistent banner indicating sample / demo data is in use.

## Purpose
SampleDataModeLayout is the trustworthy way to let users explore a feature with synthetic data without ever forgetting they are looking at a demo. It pins a `BannerAlert` to the top of the content region with a primary action ("Connect real data") and an optional dismiss-into-explanation toggle. By centralizing the framing, the product never accidentally ships a demo page that looks indistinguishable from real data, and the exit path to live mode is uniform.

## When to use
- A new feature surface that ships with synthetic data while the user evaluates it
- A documentation walkthrough rendering live components against fixture data
- Any state where data shown is intentionally not the user's real records

## When NOT to use
- A genuine empty state with no data → use **EmptyStateScaffoldLayout**
- A non-blocking informational tip → use **BannerAlert** in the content directly
- A loading state masquerading as sample data → use **Skeleton**

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="column" gap>`                | hand-rolled flex CSS                          |
| Sample-mode banner    | `BannerAlert variant="info">` with action    | raw `<div>` styled as a banner                |
| Banner action         | `Button variant="primary" size="sm">`        | raw `<button>` with inline styles             |
| Content region        | `Box>` (children slot)                       | raw `<div>` with overflow CSS                 |

## API contract
```ts
interface SampleDataModeLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  message?: ReactNode;             // default "You're viewing sample data."
  onConnectRealData?: () => void;
  connectLabel?: string;           // default "Connect real data"
  dismissible?: boolean;           // banner can be collapsed (state persists per-session)
  onDismiss?: () => void;
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | Banner pinned above content with primary action                       |
| dismissed       | Banner collapses to a compact pill; pill expands on click             |
| no-action       | When `onConnectRealData` is omitted, banner shows message only        |
| narrow viewport | Banner action wraps below the message                                 |

## Accessibility
- Banner uses `role="status"` (non-blocking, polite) supplied by `BannerAlert`
- Connect-real-data button is the primary keyboard target inside the banner
- Dismiss control exposes `aria-expanded` referencing the banner id
- The wrapper does not interfere with the document's landmark structure

## Tokens
- Inherits surface tokens from `BannerAlert` and layout tokens from `Box`
- Adds (component tier): `--sample-data-mode-banner-gap`, `--sample-data-mode-pill-padding`

## Do / Don't
```tsx
// DO
<SampleDataModeLayout onConnectRealData={openConnect}>
  <DashboardFrame>{…}</DashboardFrame>
</SampleDataModeLayout>

// DON'T — fabricate the banner
<div className="sample-banner">You are in demo mode</div>

// DON'T — raw button for the action
<SampleDataModeLayout onConnectRealData={…}>
  <button>Connect</button>
</SampleDataModeLayout>

// DON'T — silently render demo data with no banner
<DashboardFrame>{…}</DashboardFrame>   // missing the framing
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `SampleDataModeLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Banner is rendered above children by default
- `onConnectRealData` is invoked when the banner action is clicked
- `dismissible` toggles between expanded banner and compact pill
- `onDismiss` fires once on dismiss
- Children render unchanged below the banner
- Composition probes: `BannerAlert` resolves as the banner; `Box` is the frame
- Forwards ref; spreads remaining props onto root
- axe-core passes in expanded and dismissed states
