---
name: SharedLinkLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Input, Button, Card, Tabs]
replaces-raw: []
---

# SharedLinkLayout

> A tabbed surface for generating, copying, and embedding a shareable link to the current resource.

## Purpose
"Share" surfaces converge on the same shape: a copyable URL, an embed snippet, and (optionally) access controls — usually under tabs. SharedLinkLayout owns those tabs, the copy-button affordance on the URL field, and the snippet card so every share dialog has identical ergonomics regardless of what's being shared.

## When to use
- Sharing a report, dashboard, or saved view via URL
- Generating an embed snippet for an external site or wiki
- Any flow that ends with "copy this link/code"

## When NOT to use
- Configuring scheduled delivery → use **ScheduledDeliveryLayout**
- Sending an export file → use **ExportConfigurationLayout**
- Inviting users with roles → use **UserManagementLayout**'s invite flow

## Composition (required)
| Concern             | Use                                                  | Never                                  |
|---------------------|------------------------------------------------------|----------------------------------------|
| Frame layout        | `Box direction="column" gap>`                        | hand-rolled flex CSS                   |
| Tab switcher        | `Tabs`                                               | hand-rolled tablist                    |
| Section grouping    | `Card`                                               | raw `<div>` with border CSS            |
| URL / token field   | `Input` (read-only) + `Button` (copy)                | raw `<input>` / raw `<button>`         |
| Embed snippet       | `Card` containing `Input` (read-only multi-line)     | raw `<textarea>` with code styling     |
| Action row          | `Box direction="row" justify="end" gap>`             | hand-rolled flex CSS                   |

## API contract
```ts
type ShareTab = "link" | "embed" | "access";

interface SharedLinkLayoutProps extends HTMLAttributes<HTMLDivElement> {
  url: string;
  embedSnippet?: string;
  accessControls?: ReactNode;         // optional access tab content
  activeTab?: ShareTab;               // controlled
  defaultActiveTab?: ShareTab;        // uncontrolled, default "link"
  onActiveTabChange?: (tab: ShareTab) => void;
  onCopy?: (kind: "url" | "embed") => void;
  onRegenerate?: () => void;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State           | Behavior                                                                  |
|-----------------|---------------------------------------------------------------------------|
| default         | Link tab active; URL field rendered with copy `Button`                    |
| embed-tab       | Embed snippet rendered inside `Card` with a copy `Button`                 |
| access-tab      | `accessControls` slot rendered (when provided)                            |
| no-embed        | When `embedSnippet` omitted, embed tab not rendered                       |
| copied          | Copy button reflects a transient "copied" affordance via its own state    |

## Accessibility
- `Tabs` provides `role="tablist"`, `tab`, and `tabpanel` wiring
- URL and embed `Input` controls are `readOnly` with descriptive `aria-label`
- Copy buttons announce success via a polite live region or via the `Button` accessible name change
- Regenerate action exposes a confirmation step before mutating the URL (caller-controlled)

## Tokens
- Inherits all tokens from `Box`, `Input`, `Button`, `Card`, `Tabs`
- Adds (component tier): `--shared-link-section-gap`

## Do / Don't
```tsx
// DO
<SharedLinkLayout
  url={shareUrl}
  embedSnippet={iframe}
  onCopy={(kind) => track("share-copy", { kind })}
/>

// DON'T — hand-rolled tablist
<div className="tabs"><div className="tab active">Link</div>…</div>

// DON'T — raw input/button for the URL row
<input value={url} readOnly/><button>Copy</button>

// DON'T — code block with hardcoded color
<pre style={{ background: "#222" }}>{snippet}</pre>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `SharedLinkLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders the URL field and copy button in the link tab
- Switching tabs emits `onActiveTabChange` and reveals the matching panel
- `onCopy` invoked with the correct kind when each copy button is activated
- Embed tab is hidden when `embedSnippet` is not provided
- Composition probes: `Tabs`, `Card`, `Input`, `Button` resolve in their respective tabs
- Forwards ref; spreads remaining props onto root
- axe-core passes for each tab
