---
name: Avatar
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-display]
uses: [Text, Icon, Dot]
replaces-raw: ["<img> used as a profile picture"]
---

# Avatar

> A user/entity image with deterministic fallback to initials, then to an icon.

## Purpose
Avatar guarantees that every user-image surface in the product handles missing/broken images the same way: try the image, fall back to initials from the name, then fall back to a generic person icon. It owns the size scale, shape (circle/square), and (when present) the live presence dot.

## When to use
- Showing the current user, the author of a comment, a list of collaborators
- A row in a directory/people-picker
- Any place an entity (org, project) needs a graphical representation

## When NOT to use
- A user identity chip with name + role → use **PersonChip** (domain) — composes Avatar + Text
- An avatar group with overflow ("+3") → use **AvatarGroup** (composite)
- A profile header card → use a **ProfileHeader** (domain)

## Composition (required)
| Concern             | Use                                | Never                              |
|---------------------|------------------------------------|------------------------------------|
| Image element       | Owns raw `<img>`                   | bg-image on a `<div>`              |
| Initials fallback   | `Text size="caption" weight="semibold">` | raw styled `<span>`           |
| Icon fallback       | `Icon name="user">`                | inline `<svg>`                     |
| Presence indicator  | `Dot variant="success" / "warning" / "neutral">` | `::after` pseudo-element  |

## API contract
```ts
type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarShape = "circle" | "square";
type AvatarPresence = "online" | "away" | "offline";

interface AvatarOwnProps {
  src?: string;
  alt: string;                 // required for a11y
  name?: string;               // used to derive initials fallback
  size?: AvatarSize;           // default "md"
  shape?: AvatarShape;         // default "circle"
  presence?: AvatarPresence;   // optional — renders a Dot in the corner
}

export type AvatarProps = AvatarOwnProps & HTMLAttributes<HTMLSpanElement>;
```

## Required states
| State            | Behavior                                                          |
|------------------|-------------------------------------------------------------------|
| with image       | Renders `<img src>` with `alt=""` (decorative; container carries label) |
| image error      | Falls back to initials when `name` is set                          |
| no image, no name | Falls back to `Icon name="user"` sized to the avatar              |
| with presence    | Overlays a `Dot` in the bottom-right                              |

## Accessibility
- Container has `role="img"` and `aria-label={alt}`; the inner `<img>` uses `alt=""` to avoid double announcement.
- `name` is for visual fallback, not announcement — `alt` carries the screen-reader label.
- Presence Dot must be paired with a textual presence label elsewhere (e.g., in a tooltip or PersonChip).

## Tokens
- Size: `--avatar-size-{sm|md|lg|xl}`
- Background (initials/icon fallback): `--avatar-background-fallback`
- Text (initials): `--avatar-text-fallback` (resolved via `Text color="inverse"`)
- Border: `--avatar-border` (optional thin ring)
- Radius: `--radius-{md|full}` (square → md, circle → full)

## Do / Don't
```tsx
// DO
<Avatar src={url} alt="Cliff Pyles" name="Cliff Pyles" />
<Avatar alt="Unknown user" />                    // → Icon fallback
<Avatar src="…" alt="Ada" name="Ada Lovelace" presence="online" />

// DON'T — initials hand-typed by the consumer
<Avatar alt="CP">CP</Avatar>                     // pass name="Cliff Pyles" instead

// DON'T — icon fallback wired manually
<Avatar alt="?"><svg>…</svg></Avatar>
```

## Forbidden patterns (enforced)
- Inline `<svg>` for the fallback — use `Icon`
- Raw styled `<span>` for initials — use `Text`
- `::before`/`::after` colored dots for presence — use `Dot`
- Hardcoded color, size, radius
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- With `src`, renders `<img>` with `alt=""`
- On image error, falls back to initials when `name` is set
- Without `src` or `name`, renders the user icon
- Initials derived from one- and two-word names correctly (uppercase, max 2 chars)
- `presence` renders a `Dot` with the corresponding variant
- Forwards ref; spreads remaining props
- axe-core passes in each fallback state
