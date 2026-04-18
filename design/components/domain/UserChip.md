---
name: UserChip
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, UserAvatar, Text]
replaces-raw: []
---

# UserChip

> A compact identity chip — avatar + name (and optional secondary line) for inline use.

## Purpose
UserChip is the canonical "person reference inline" — the assignee column, the comment author byline, the row in a participants list. It owns the avatar+name layout, the secondary line (role, email, status), and the click-to-profile navigation so user references look the same everywhere.

## When to use
- Assignee or owner column in a list/table
- Author byline on a comment, audit entry, or notification
- Participant row in a sidebar or modal

## When NOT to use
- A multi-select user picker → use **UserPicker**
- Just an avatar with no name → use **UserAvatar**
- An inline mention inside text → use **MentionToken**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="sm">` | hand-rolled inline CSS  |
| Avatar          | `UserAvatar`                                     | base `Avatar` directly         |
| Name            | `Text size="inherit" weight="medium" truncate>`  | raw styled `<span>`            |
| Secondary line  | `Text size="sm" color="secondary" truncate>`     | raw styled `<span>`            |
| Anchor          | Owns raw `<a>` when `href` is provided           | wrapping `<button>`            |

## API contract
```ts
interface UserChipProps extends HTMLAttributes<HTMLSpanElement> {
  user: { id: string; name: string; avatarUrl?: string; secondary?: string; status?: "active" | "away" | "do-not-disturb" | "offline" };
  href?: string;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  layout?: "inline" | "stacked";        // stacked → name over secondary
}
```

## Required states
| State        | Behavior                                                         |
|--------------|------------------------------------------------------------------|
| default      | Avatar + name; secondary if present                              |
| linked       | `href` provided → entire chip is an `<a>`                        |
| stacked      | Name and secondary stack vertically next to the avatar           |
| status       | `showStatus` overlays presence on `UserAvatar`                   |
| long names   | Name and secondary truncate with ellipsis; full text in `title`  |

## Accessibility
- Avatar carries `aria-label`; chip itself uses descriptive `<a>` text when linked
- Status (if shown) accompanied by status text in `aria-label` ("Cliff Pyles, away")
- Truncated text exposed via `title`

## Tokens
- Inherits tokens from `UserAvatar` and `Text`
- Adds: `--user-chip-gap`, `--user-chip-stack-gap`

## Do / Don't
```tsx
// DO
<UserChip user={author} />
<UserChip user={assignee} href={`/users/${assignee.id}`} showStatus />
<UserChip user={user} secondary={user.role} layout="stacked" />

// DON'T — assemble manually
<><Avatar src={user.url}/> <span>{user.name}</span></>

// DON'T — use base Avatar
<UserChip user={u} /* but UserAvatar is required */ />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `UserAvatar` + name; secondary appears when provided
- `href` produces an `<a>` wrapping the entire chip
- `layout="stacked"` stacks name over secondary
- `showStatus` propagates to `UserAvatar`
- Truncation exposes full text via `title`
- Forwards ref; spreads remaining props onto root
- Composition probe: `UserAvatar` resolves in DOM
- axe-core passes
