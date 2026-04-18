---
name: ErrorState
tier: composite
level: 5
status: stable
since: 0.5.0
patterns: [states]
uses: [Box, Text, Icon, Button]
replaces-raw: ["<div role=\"alert\">", "<pre>"]
---

# ErrorState

> A centered, alert-typed placeholder explaining that something failed and offering recovery.

## Purpose
ErrorState is the section-level error message: a card-or-region replacement that appears when a query, render, or operation fails. It owns the alert role, the error illustration, the optional retry button (with its loading state), and a collapsible technical-details panel for engineers and power users. Page-level errors and toasts are separate concerns; ErrorState fills the bounds of the component that failed.

## When to use
- A panel whose data fetch failed
- A chart or table region that couldn't render
- Any bounded surface where the user needs to see the failure and a retry path

## When NOT to use
- Field-level validation errors — use **FormField** error slot
- Transient operation failures — use a toast
- Full-page errors (404, 500) — use a page-level error layout
- "No data exists" — that's empty, not error → use **EmptyState**

## Composition (required)
| Concern         | Use                                              | Never                                  |
|-----------------|--------------------------------------------------|----------------------------------------|
| Root layout     | `Box display="flex" direction="column" align="center" gap role="alert">` | hand-rolled flex CSS    |
| Illustration    | `Icon name="alert-circle" size="xl" color="error">` | inline `<svg>`                      |
| Title           | `Text as="h3" size="lg" weight="semibold">`      | raw `<h3>` with typography CSS         |
| Description     | `Text as="p" size="sm" color="secondary">`       | raw `<p>` with typography CSS          |
| Retry action    | `Button variant="secondary" size="sm" loading={retrying}>` | raw `<button>` with manual spinner |
| Details toggle  | `Button variant="ghost" size="sm">`              | raw `<button>` with manual focus styles |
| Details content | `Box>` with monospace token-driven font          | raw `<pre>` with hardcoded font CSS    |

## API contract
```ts
interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;                  // default "Something went wrong"
  description?: ReactNode;
  onRetry?: () => void;            // when provided, renders a Retry Button
  retrying?: boolean;              // forwarded to Retry Button's loading prop
  details?: string;                // when provided, renders a collapsible code panel
}
```

## Required states
| State            | Behavior                                                              |
|------------------|-----------------------------------------------------------------------|
| default          | Icon + title; no retry; no details                                    |
| with description | Description text rendered below title                                 |
| with retry       | Retry `Button` rendered; clicking calls `onRetry`                     |
| retrying         | Retry `Button` shows loading spinner and is disabled                  |
| with details (collapsed) | Details toggle `Button` renders with `aria-expanded="false"`  |
| with details (expanded)  | Code block reveals; toggle label flips to "Hide details"; `aria-expanded="true"` |

## Accessibility
- Root region carries `role="alert"` so the failure is announced when it appears.
- The icon is decorative — title carries the accessible meaning.
- Details toggle uses `aria-expanded` to reflect the collapsed/expanded state.
- Retry `Button` inherits accessibility from `Button` (loading sets aria appropriately).

## Tokens
- Layout: inherited from `EmptyState`'s spacing tokens or `--error-state-gap`, `--error-state-padding`
- Icon color: `--color-status-error` via `Icon color="error"`
- Details panel: `--font-family-mono`, `--color-surface-subtle`, `--radius-sm`

## Do / Don't
```tsx
// DO
<ErrorState
  title="Couldn't load activity"
  description="The server returned an unexpected response."
  onRetry={refetch}
  retrying={isRetrying}
  details={errorMessage}
/>

// DON'T — empty data treated as error
<ErrorState title="No projects yet"/>      // use EmptyState

// DON'T — raw retry button
<ErrorState title="…" /> <button onClick={retry}>Retry</button>

// DON'T — inline svg illustration
<div><svg>…</svg><h3>Failed</h3></div>
```

## Forbidden patterns (enforced)
- Raw styled `<h1>`-`<h6>`, `<p>`, `<span>` (use `Text`)
- Raw `<pre>` (use `Box` with monospace font token)
- Inline `<svg>` (use `Icon`)
- Raw `<button>` (use `Button`)
- Hand-rolled spinner for the retrying state (use `Button loading`)
- Hand-rolled flex CSS (use `Box`)
- Hardcoded color, spacing, font-size values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Root has `role="alert"`
- Renders default title when none provided
- `onRetry` callback fires on Retry button click
- `retrying` propagates to Retry `Button`'s loading state
- Details panel toggles open/closed; `aria-expanded` reflects state
- Composition probe: `Button` renders both retry and details toggle; `Icon` renders the alert glyph
- axe-core passes in default, with-retry, retrying, expanded-details
