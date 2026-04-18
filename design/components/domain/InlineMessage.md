---
name: InlineMessage
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Text]
replaces-raw: []
---

# InlineMessage

> A scoped, in-flow message that explains state for a field, section, or panel.

## Purpose
InlineMessage is the canonical way to attach an explanatory note to a piece of content — a hint under a field, a warning above a section, a confirmation inside a card. It owns the icon-plus-text layout and severity vocabulary so every contextual note in the product reads the same way.

## When to use
- A help, warning, or error note attached to a section of UI
- A non-modal confirmation rendered next to the affected content
- A short explanation of why a control is disabled

## When NOT to use
- A page-wide announcement → use **BannerAlert**
- A field-level error inside a form control → use **FormField** error slot (which composes this)
- A transient toast → use **Toast**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="start" gap="2">` | hand-rolled flex/gap in `InlineMessage.css` |
| Severity icon   | `Icon size="sm">`                  | inline `<svg>`                     |
| Body text       | `Text size="sm" color="secondary">`| raw `<span>` / `<p>` with styles   |

## API contract
```ts
type InlineMessageSeverity = "info" | "success" | "warning" | "error";

interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  severity?: InlineMessageSeverity;   // default "info"
  icon?: boolean;                     // default true
  children: ReactNode;
}
```
Component uses `forwardRef<HTMLDivElement, InlineMessageProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| info     | Neutral text color + info icon                                        |
| success  | Success text color + check icon                                       |
| warning  | Warning text color + warning icon                                     |
| error    | Error text color + alert icon                                         |
| no-icon  | `icon={false}` → only text rendered, severity via color/text contrast |

## Accessibility
- Root: `role="status"` for info/success, `role="alert"` for warning/error.
- Icon is decorative (`aria-hidden`) since severity is also encoded in token color and adjacent context.
- When used as a field hint, parent `FormField` wires `aria-describedby` — this component does not.

## Tokens
- Text: `--inline-message-text-{info|success|warning|error}`
- Icon: `--inline-message-icon-{info|success|warning|error}`
- Gap inherited from `Box`: `--space-2`

## Do / Don't
```tsx
// DO
<InlineMessage severity="warning">Changes apply to all members of this team.</InlineMessage>

// DO — without icon
<InlineMessage severity="info" icon={false}>Optional</InlineMessage>

// DON'T — hand-rolled icon row
<div className="msg"><svg/>…</div>

// DON'T — paragraph-of-text content
<InlineMessage>{longArticle}</InlineMessage>     // use BannerAlert or section copy
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `severity` renders correct text token and icon name
- `icon={false}` omits the `Icon`
- `role` switches between `status` and `alert` based on severity
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Box"]` wraps content
- axe-core passes in each severity
