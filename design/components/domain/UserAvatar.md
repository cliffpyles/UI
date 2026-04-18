---
name: UserAvatar
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Avatar]
replaces-raw: []
---

# UserAvatar

> Project-conventional user avatar — `Avatar` with name-derived initials and presence wired to identity rules.

## Purpose
UserAvatar specializes the base `Avatar` for the most common case: representing a person. It applies the project's deterministic initials algorithm, the standard presence mapping (`status` → `presence`), and the consistent default size so user representations match across surfaces. It is the avatar component every other domain component composes when showing a person.

## When to use
- Anywhere a single user image is shown
- Inside `UserChip`, `UserPicker`, comment threads, assignee columns
- Avatar group entries that need person semantics

## When NOT to use
- An organization or non-person entity → use base **Avatar** with shape="square"
- Identity chip with name + role → use **UserChip**
- Stack with overflow ("+3") → use **AvatarGroup** (composite)

## Composition (required)
| Concern         | Use                                          | Never                          |
|-----------------|----------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex">` (only if needed for status overlay alignment) | hand-rolled CSS |
| Image / fallback chain | `Avatar`                              | reimplementing image+initials  |
| Presence dot    | `Avatar`'s `presence` prop                   | hand-rolled colored dot        |

## API contract
```ts
type UserStatus = "active" | "away" | "do-not-disturb" | "offline" | "invisible";

interface UserAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  user: { id: string; name: string; avatarUrl?: string; status?: UserStatus };
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;          // default false
}
```

## Required states
| State         | Behavior                                                        |
|---------------|-----------------------------------------------------------------|
| with image    | Renders `Avatar` with `src=user.avatarUrl`, `alt=user.name`     |
| no image      | Falls through to `Avatar` initials from `user.name`             |
| presence on   | `showStatus` → `Avatar.presence` derived from `user.status`     |
| dnd / offline | Status mapped to the appropriate `Avatar.presence` token        |
| missing user  | Renders `Avatar` icon fallback with `alt="Unknown user"`        |

## Accessibility
- Defers to `Avatar` for `role="img"` and `aria-label`
- `alt` always derived from `user.name` (never empty when name is known)
- Presence dot accompanied by status text in tooltip-paired components like `UserChip`

## Tokens
- Inherits all tokens from `Avatar`
- Adds: none

## Do / Don't
```tsx
// DO
<UserAvatar user={currentUser} />
<UserAvatar user={author} size="sm" showStatus />

// DON'T — base Avatar with manual initials
<Avatar alt="CP" name="Cliff Pyles" src={url} />

// DON'T — ad-hoc status mapping
<Avatar presence={user.status === "active" ? "online" : "offline"} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `Avatar` with `src` and `alt` derived from `user`
- Initials fallback when no `avatarUrl`
- `showStatus` maps each `UserStatus` to the correct `Avatar.presence`
- Missing `user` renders icon fallback with "Unknown user"
- Forwards ref; spreads remaining props onto root
- Composition probe: `Avatar` resolves in DOM
- axe-core passes
