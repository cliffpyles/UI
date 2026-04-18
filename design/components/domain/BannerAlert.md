---
name: BannerAlert
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Text, Button]
replaces-raw: []
---

# BannerAlert

> A persistent, page-level alert that announces a system or account-level issue requiring user awareness.

## Purpose
BannerAlert surfaces information that applies to the whole page or session — billing problems, scheduled maintenance, degraded service, trial expirations. It is the canonical full-width announcement strip so every product surface uses one consistent shape, severity language, and dismiss model rather than reinventing a banner per page.

## When to use
- A billing, account, or compliance issue the user must see across the product
- A maintenance or incident notice that should remain visible until resolved
- A trial / quota expiration that affects the entire workspace

## When NOT to use
- A transient confirmation ("Saved") → use **Toast**
- A field-level validation message → use **InlineMessage**
- An empty page state → use **EmptyState**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="3" padding="3"` | hand-rolled flex/padding in `BannerAlert.css` |
| Severity icon   | `Icon`                             | inline `<svg>`                     |
| Title text      | `Text weight="semibold" size="sm">`| raw styled `<span>` / `<strong>`   |
| Body text       | `Text size="sm" color="secondary">`| raw `<p>` with typography CSS      |
| Action          | `Button variant="ghost" size="sm">`| raw `<button>` / raw `<a>` styled  |
| Dismiss control | `Button` icon-only ghost + `Icon name="x"` | raw `<button>` with inline svg |

## API contract
```ts
type BannerAlertSeverity = "info" | "success" | "warning" | "error";

interface BannerAlertProps extends HTMLAttributes<HTMLDivElement> {
  severity?: BannerAlertSeverity;     // default "info"
  title?: ReactNode;
  children?: ReactNode;               // body
  action?: { label: string; onAction: () => void };
  dismissible?: boolean;              // default false
  onDismiss?: () => void;
}
```
Component uses `forwardRef<HTMLDivElement, BannerAlertProps>`.

## Required states
| State       | Behavior                                                          |
|-------------|-------------------------------------------------------------------|
| info        | Neutral surface + info icon                                       |
| success     | Success surface + check icon                                      |
| warning     | Warning surface + warning icon                                    |
| error       | Error surface + alert icon                                        |
| dismissible | Trailing dismiss `Button` rendered; calls `onDismiss` on click    |
| with action | Inline `Button` rendered between body and dismiss                 |

## Accessibility
- Root: `role="status"` for info/success, `role="alert"` for warning/error.
- Severity is conveyed by both `Icon` and color — never color alone.
- Dismiss button has `aria-label="Dismiss alert"`.
- Title (when provided) is rendered with `Text as="strong">` so it's announced before the body.

## Tokens
- Surface: `--banner-alert-surface-{info|success|warning|error}`
- Border: `--banner-alert-border-{info|success|warning|error}`
- Text: `--banner-alert-text-{info|success|warning|error}`
- Icon: `--banner-alert-icon-{info|success|warning|error}`
- Padding inherited from `Box`: `--space-3`
- Radius: `--radius-md`

## Do / Don't
```tsx
// DO
<BannerAlert severity="warning" title="Trial ends in 3 days"
  action={{ label: "Upgrade", onAction: openBilling }} dismissible onDismiss={ack}>
  You'll lose access to advanced features when your trial expires.
</BannerAlert>

// DON'T — hand-rolled close
<BannerAlert>…<button onClick={x}><svg/></button></BannerAlert>

// DON'T — color-only severity
<BannerAlert /* no severity */ style={{ background: "red" }}>Failed</BannerAlert>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `severity` renders correct icon and surface token
- `dismissible` renders dismiss `Button`; click fires `onDismiss`
- `action` renders inline `Button`; click fires `onAction`
- `role` switches between `status` and `alert` based on severity
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Icon"]` and `[data-component="Text"]` resolve
- axe-core passes in each severity, with and without action
