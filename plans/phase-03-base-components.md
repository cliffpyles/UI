# Phase 3: Base Components

**Architecture Level:** Level 3 (Molecules)
**Dependencies:** Phase 2 (Primitives)
**Source of truth:** [design/architecture.md](../design/architecture.md) (Level 3 rules), [design/standards/api-design.md](../design/standards/api-design.md), [design/standards/accessibility.md](../design/standards/accessibility.md), [design/patterns/states.md](../design/patterns/states.md)

## Objective

Build the base component set — the primary building blocks that combine primitives into units with a single, coherent purpose. Each component handles its own accessibility (ARIA roles, keyboard interaction, focus management) and supports controlled/uncontrolled usage where applicable.

## Directory Structure

```
src/
  components/               # Existing directory
    Button/                  # Refactor existing
    Input/
    Checkbox/
    Radio/
    Toggle/
    Select/
    Tag/
    Avatar/
    Tooltip/
    Skeleton/
    index.ts                 # Barrel export
```

## Components

### Button (refactor existing)

Refactor the existing Button to comply with the full API spec.

**Changes from existing:**
- Add `forwardRef`.
- Add `loading` prop with Spinner integration.
- Add polymorphic `as` prop (renders as `<a>` when `href` is provided).
- CSS migrated to use CSS custom properties instead of hardcoded values.
- Component tokens (`button.background.primary`, etc.) referenced in CSS.
- 44px minimum hit area per [design/standards/accessibility.md](../design/standards/accessibility.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "destructive"` | `"primary"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `loading` | `boolean` | `false` |
| `as` | `"button" \| "a"` | `"button"` |
| + extends `ButtonHTMLAttributes` or `AnchorHTMLAttributes` | | |

**Tests:** All existing tests plus: loading state shows Spinner and disables interaction, `as="a"` renders an anchor, ref forwarding, axe-core, keyboard activation (Enter + Space).

### Input

Text input field with support for leading/trailing icons and addons.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `error` | `boolean` | `false` |
| `leadingIcon` | `ReactNode` | — |
| `trailingIcon` | `ReactNode` | — |
| `leadingAddon` | `ReactNode` | — |
| `trailingAddon` | `ReactNode` | — |
| + extends `InputHTMLAttributes` | | |

Supports controlled (`value`/`onChange`) and uncontrolled (`defaultValue`).

**CSS:** Uses `input.border.default`, `input.border.focus`, `input.border.error` component tokens. Focus ring uses `color.focus.ring`.

**Tests:**
- Renders input with correct type attributes.
- Controlled and uncontrolled modes work.
- Error state applies error border and `aria-invalid="true"`.
- Leading/trailing icons render correctly.
- Focus management: focus ring visible on keyboard focus.
- Disabled state prevents interaction.
- Forwards ref to the `<input>` element.
- axe-core passes (requires associated label in tests).

### Checkbox

A checkbox input with label support.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | — |
| `defaultChecked` | `boolean` | — |
| `onChange` | `(checked: boolean) => void` | — |
| `indeterminate` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `label` | `ReactNode` | — |
| `description` | `ReactNode` | — |

**Accessibility:** Custom styled but uses a visually-hidden native `<input type="checkbox">` for correct semantics. `aria-checked="mixed"` for indeterminate.

**Tests:**
- Toggles on click (controlled and uncontrolled).
- Indeterminate state renders correctly.
- Keyboard: Space toggles.
- Label click toggles checkbox.
- Disabled prevents interaction.
- axe-core passes.

### Radio

Radio button input, used within a RadioGroup.

**RadioGroup props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | — |
| `defaultValue` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `name` | `string` | auto-generated |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` |
| `disabled` | `boolean` | `false` |

**Radio props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | required |
| `label` | `ReactNode` | — |
| `description` | `ReactNode` | — |
| `disabled` | `boolean` | `false` |

**Accessibility:** Uses `role="radiogroup"` on the group. Arrow keys move selection between radio buttons within the group.

**Tests:**
- Only one radio selected at a time within group.
- Arrow key navigation between radios.
- Controlled and uncontrolled.
- Disabled state (individual and group-level).
- axe-core passes.

### Toggle

An on/off switch, semantically a checkbox but visually a toggle.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | — |
| `defaultChecked` | `boolean` | — |
| `onChange` | `(checked: boolean) => void` | — |
| `disabled` | `boolean` | `false` |
| `size` | `"sm" \| "md"` | `"md"` |
| `label` | `ReactNode` | — |

**Accessibility:** Uses `role="switch"` and `aria-checked`.

**Tests:**
- Toggles on click and Space key.
- Visual state matches checked state.
- Disabled state.
- axe-core passes.

### Select

A native-like select dropdown. (Note: the compound-component rich dropdown is Phase 4.)

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | — |
| `defaultValue` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `placeholder` | `string` | — |
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | required |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `error` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |

Uses a styled native `<select>` element for maximum accessibility and mobile support. For rich dropdowns with search, custom rendering, and multi-select, see Phase 4 `Dropdown`.

**Tests:**
- Renders all options. Correct option selected.
- Controlled and uncontrolled.
- Placeholder renders as disabled first option.
- Error state.
- Disabled state.
- axe-core passes.

### Tag

A compact label for categorization or filter display.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `variant` | `"neutral" \| "primary" \| "success" \| "warning" \| "error"` | `"neutral"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `removable` | `boolean` | `false` |
| `onRemove` | `() => void` | — |

**Tests:**
- Renders with correct variant color.
- Removable tag shows X button.
- onRemove called on X click.
- Removable X button has accessible label: "Remove [tag content]".
- Keyboard: Enter/Space on X button triggers remove.
- axe-core passes.

### Avatar

A user avatar showing an image, initials, or a fallback icon.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `src` | `string` | — |
| `alt` | `string` | required |
| `name` | `string` | — |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `shape` | `"circle" \| "square"` | `"circle"` |

**Fallback chain:** Image → Initials (from `name`) → User icon (from Icon primitive).

**Tests:**
- Renders `<img>` when `src` is valid.
- Falls back to initials when `src` is absent.
- Falls back to icon when both `src` and `name` are absent.
- Handles image load errors (falls back to initials/icon).
- All sizes render at correct dimensions.
- `alt` attribute is present.
- axe-core passes.

### Tooltip

A popup that shows on hover/focus to provide additional information.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `content` | `ReactNode` | required |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` |
| `delay` | `number` (ms) | `500` |
| `maxWidth` | `number` (px) | `240` |

Per [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md): 500ms delay, flip when clipped, visible on focus for keyboard users.

**Accessibility:** Uses `role="tooltip"`, the trigger element gets `aria-describedby` pointing to the tooltip.

**Tests:**
- Shows on hover after delay.
- Shows on focus (no delay for keyboard).
- Hides on mouse leave and blur.
- Flips side when near viewport edge.
- Escape key dismisses.
- `role="tooltip"` and `aria-describedby` present.
- axe-core passes.

### Skeleton

A placeholder loading shape for content that hasn't loaded yet.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `variant` | `"text" \| "circle" \| "rect"` | `"text"` |
| `width` | `string \| number` | `"100%"` |
| `height` | `string \| number` | `"1em"` |
| `lines` | `number` | `1` |

Per [design/foundations/motion.md](../design/foundations/motion.md): pulse animation, 1.5s cycle, respects `prefers-reduced-motion`.

**Tests:**
- Renders with correct dimensions.
- Multiple `lines` renders multiple skeleton rows.
- Has `aria-busy="true"` and appropriate label.
- Animation present (CSS class check, not visual test).
- axe-core passes.

## Development Order

1. Input (heavily used, establishes controlled/uncontrolled pattern)
2. Button (refactor existing)
3. Checkbox
4. Radio + RadioGroup
5. Toggle
6. Select
7. Tag
8. Avatar
9. Tooltip
10. Skeleton
11. Barrel exports + dev playground updates

## Testing Strategy

Every base component test file includes:

1. **Rendering tests**: Default props, each prop variation.
2. **Interaction tests**: Click, keyboard (Enter, Space, arrows, Escape, Tab).
3. **State tests**: Default, hover (where testable), focus, disabled, loading, error.
4. **Controlled/uncontrolled** (for input components): Both modes work correctly.
5. **Accessibility**: axe-core check, ARIA attributes verified, keyboard navigation complete.
6. **API contract**: Ref forwarded, remaining props spread, className merging.
7. **Edge cases**: Empty content, very long text, special characters.

## Completion Criteria

- [x] All 10 base components implemented.
- [x] All components use CSS custom properties from tokens.
- [x] All components support density via DensityProvider context.
- [x] All components work in light and dark themes.
- [x] All components forward refs and spread props.
- [x] All components have comprehensive test suites with axe-core.
- [x] Input components support controlled and uncontrolled usage.
- [x] Tooltip supports keyboard focus, delay, and viewport flipping.
- [x] Components exported from `src/components/index.ts` and `src/index.ts`.
- [x] Dev playground updated with Base Components section.
- [x] `npm run typecheck && npm run lint && npm test` passes.
