---
name: Toast
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Text, Button]
replaces-raw: []
---

# Toast

> A transient, auto-dismissing notification that confirms an action or surfaces a brief system event.

## Purpose
Toast handles non-blocking feedback — the kind of "Saved", "Copied", "Upload failed" message that should appear, optionally offer an action, and disappear on its own. It owns the auto-dismiss timer, stacking order, and ARIA live behavior so every toast in the product behaves identically.

## When to use
- Confirmation of a completed action ("Project saved")
- A non-blocking error ("Couldn't sync — retry")
- A short-lived system event the user can ignore

## When NOT to use
- A persistent issue requiring acknowledgement → use **BannerAlert**
- A field/section explanation → use **InlineMessage**
- A modal confirmation that blocks progress → use **Modal**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="start" gap="3" padding="3">` | hand-rolled flex/padding |
| Severity icon   | `Icon>`                            | inline `<svg>`                     |
| Title text      | `Text size="sm" weight="medium">`  | raw `<strong>` / styled `<span>`   |
| Body text       | `Text size="sm" color="secondary">`| raw `<p>` with typography CSS      |
| Inline action   | `Button variant="ghost" size="sm">`| raw `<button>`                     |
| Dismiss control | `Button` icon-only ghost + `Icon name="x"` | raw `<button>` with inline svg |

## API contract
```ts
type ToastSeverity = "info" | "success" | "warning" | "error";

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  severity?: ToastSeverity;           // default "info"
  title?: ReactNode;
  children?: ReactNode;               // body
  action?: { label: string; onAction: () => void };
  duration?: number | null;           // ms; null disables auto-dismiss; default 5000
  onDismiss?: () => void;
}
```
Component uses `forwardRef<HTMLDivElement, ToastProps>`. A separate `ToastProvider` (out of scope here) manages the stack and portal.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| visible      | Mounted, timer running                                            |
| paused       | Hover/focus pauses the auto-dismiss timer                         |
| with action  | Inline `Button` rendered; clicking does not auto-dismiss          |
| dismissed    | Timer expired or dismiss clicked → `onDismiss` fires; component unmounts |

## Accessibility
- Root: `role="status"` for info/success, `role="alert"` for warning/error.
- `aria-live="polite"` for status, `aria-live="assertive"` for alert.
- Hover and keyboard focus pause the timer to give users time to read.
- Dismiss button has `aria-label="Dismiss notification"`.
- Severity carried by both `Icon` and color — never color alone.

## Tokens
- Surface: `--toast-surface-{info|success|warning|error}`
- Text: `--toast-text-{info|success|warning|error}`
- Icon: `--toast-icon-{info|success|warning|error}`
- Shadow: `--shadow-overlay`
- Radius: `--radius-md`
- Duration: `--duration-normal` (enter/leave animation)
- Z-index: `--z-toast`

## Do / Don't
```tsx
// DO
<Toast severity="success" title="Project saved"
  action={{ label: "View", onAction: openProject }}>
  Changes are visible to your team.
</Toast>

// DON'T — sticky toast
<Toast duration={null}>…</Toast>     // use BannerAlert for persistent

// DON'T — hand-rolled close glyph
<Toast>…<span onClick={x}>×</span></Toast>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `duration` ms triggers auto-dismiss; `duration={null}` disables it
- Hover and focus pause the timer; blur/leave resume
- `action` renders `Button`; click fires `onAction`
- Dismiss `Button` fires `onDismiss`
- `role` and `aria-live` switch by severity
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Icon"]`, `[data-component="Text"]` resolve
- axe-core passes in each severity
