---
name: TeamBadge
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Icon, Badge]
replaces-raw: []
---

# TeamBadge

> An identifier for a team — color-coded badge with optional icon and name.

## Purpose
TeamBadge renders the canonical "Platform · 🟦", "Design · 🟨" team chip used in lists, audit rows, and assignee columns. It owns the team color mapping, the optional icon, and the truncation of long names so team references read identically across the product.

## When to use
- The "team" column of a table or list row
- Inline ownership indicator on an issue or asset
- Filter chip that selects a team

## When NOT to use
- A user identity → use **UserChip**
- An entity link to a team page → use **EntityLink** with `type="team"`
- A generic colored tag with no team semantics → use **Tag**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="2xs">` | hand-rolled inline CSS  |
| Color swatch    | `Badge tone={mappedTone}>` (color-only variant)  | raw colored `<div>`            |
| Icon (optional) | `Icon>`                                          | inline `<svg>`                 |
| Team name       | `Text size="inherit" truncate>`                  | raw styled `<span>`            |

## API contract
```ts
interface TeamBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  color?: string;                  // semantic key, mapped to a tone
  icon?: string;                   // optional Icon name
  size?: "sm" | "md";
  showName?: boolean;              // default true; false → swatch only
}
```

## Required states
| State        | Behavior                                                         |
|--------------|------------------------------------------------------------------|
| default      | Color swatch + name                                              |
| swatch only  | `showName === false` → swatch + tooltip-ready `aria-label`       |
| with icon    | Icon rendered between swatch and name                            |
| long name    | Name truncates with ellipsis; full name in `title`               |

## Accessibility
- Root carries `aria-label` with team name (for swatch-only mode)
- Color is decorative; team identity always conveyed by name or `aria-label`
- Icon marked `aria-hidden`

## Tokens
- Inherits tokens from `Badge`, typography from `Text`
- Adds: `--team-badge-gap`

## Do / Don't
```tsx
// DO
<TeamBadge name="Platform" color="blue" />
<TeamBadge name="Design" color="yellow" icon="palette" />
<TeamBadge name="Platform" color="blue" showName={false} />

// DON'T — raw colored div
<div style={{ background: "blue", borderRadius: 4 }}>Platform</div>

// DON'T — plain Tag (loses team color mapping)
<Tag>Platform</Tag>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `Badge` swatch + `Text` name for default
- `showName={false}` renders swatch only with `aria-label`
- `icon` renders an `Icon` between swatch and name
- Long names truncate; full name in `title`
- Color mapping resolves through tokens, not hex
- Forwards ref; spreads remaining props onto root
- axe-core passes
