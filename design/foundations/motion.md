# Motion & Animation

Animation in data applications follows a different philosophy than in consumer apps. Every animation must earn its place. Decorative motion is a distraction when users are trying to read data.

## Principles

### 1. Purposeful Only

Animation is used for exactly three purposes:
- **Orientation:** Helping users understand where they are and what changed (page transitions, panel open/close).
- **Feedback:** Confirming that an action was received (button press, form submission, toggle).
- **Attention:** Drawing the eye to something that requires notice (new data, alerts, value changes).

If an animation doesn't serve one of these purposes, it is removed.

### 2. Fast and Unobtrusive

Data users are task-focused. Animations that delay interaction or demand attention are hostile.

| Token | Duration | Use |
|-------|----------|-----|
| `duration.instant` | 0ms | State toggles with no spatial relationship (checkbox check/uncheck) |
| `duration.fast` | 100ms | Hover states, focus indicators, small feedback |
| `duration.normal` | 200ms | Panel open/close, dropdown, tooltip appearance |
| `duration.slow` | 300ms | Page transitions, modal entrance, significant layout shifts |
| `duration.deliberate` | 500ms | Complex transitions with multiple moving elements |

Nothing exceeds 500ms. Most interactions use 100-200ms.

### 3. Reduced Motion Is First-Class

`prefers-reduced-motion` is respected globally. When active:
- All decorative transitions are removed (duration set to 0).
- Orientation animations are replaced with instant cuts or simple fades.
- Feedback animations (button press) are retained but simplified.
- Loading spinners are replaced with pulsing opacity or static indicators.

This is implemented at the token level:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-deliberate: 0ms;
  }
}
```

## Easing

| Token | Value | Use |
|-------|-------|-----|
| `easing.default` | cubic-bezier(0.2, 0, 0, 1) | Most transitions |
| `easing.enter` | cubic-bezier(0, 0, 0.2, 1) | Elements entering view (modals, dropdowns) |
| `easing.exit` | cubic-bezier(0.4, 0, 1, 1) | Elements leaving view |
| `easing.linear` | linear | Progress bars, continuous animations |

## Specific Animation Patterns

### Value Change

When a data value updates (e.g., a metric on a dashboard), signal the change without being distracting:

- **Brief highlight:** The value's background flashes a subtle color (e.g., blue-50 for 1 second, then fades). This works at low update rates (< 1 per second).
- **No animation at high rates:** If values update more than once per second, disable change animations entirely. The continuous flickering is worse than no signal.

### Panel & Drawer

Panels slide in from their origin direction. A right-side detail panel slides in from the right. A bottom sheet slides up.

Duration: `duration.normal` (200ms). Easing: `easing.enter` for open, `easing.exit` for close.

### Loading

- **Skeleton screens:** Pulse animation on placeholder shapes. Duration: 1.5s per cycle, ease-in-out. This is the default loading indicator for content regions.
- **Spinners:** Continuous rotation. Used only for actions (button loading state, inline save). Never for page-level loading.
- **Progress bars:** Linear fill for determinate progress. Indeterminate uses a left-to-right sweep.

### Dashboard Loading

When a dashboard has multiple independently-loading panels:

- Each panel shows its own skeleton state independently.
- Panels reveal individually as their data arrives — no "hold until all are ready" pattern.
- A staggered reveal (50ms delay between panels) is applied only when all panels complete within the same 200ms window, to prevent a jarring simultaneous pop-in.

### High-Volume Performance

At high data volumes (tables with 1000+ rows, charts with 10000+ points):

- Row insertion/deletion animations are disabled. The DOM change is instant.
- Chart transitions are simplified or disabled (no animated line draws, just instant render).
- Scroll-linked animations (parallax, sticky header shadows) use `will-change` and are limited to `transform` and `opacity` for compositor-only rendering.
