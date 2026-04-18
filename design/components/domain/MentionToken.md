---
name: MentionToken
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Tag]
replaces-raw: []
---

# MentionToken

> An inline entity reference (`@user`, `#channel`, `~project`) styled as a token inside running text.

## Purpose
MentionToken renders inline mentions inside comments, descriptions, and notification copy. It owns the token shape (pill/inline), the prefix glyph, and the click-to-navigate behavior so mentions read consistently whether they appear in markdown, audit logs, or activity feeds.

## When to use
- Inside rendered comment / description / message content
- Activity feed items that quote mention tokens
- Notification copy that references a user, channel, or record

## When NOT to use
- A standalone link to an entity (its own row) → use **EntityLink**
- A user identity chip (avatar + name) → use **UserChip**
- A list of selected users (multi-select tags) → use **UserPicker**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="2xs">` | hand-rolled inline CSS  |
| Pill surface    | `Tag size="sm" tone="neutral">`                  | raw `<span>` with pill CSS     |
| Prefix glyph    | `Text size="inherit" color="secondary">`         | raw styled `<span>`            |
| Display name    | `Text size="inherit">`                           | raw styled `<span>`            |
| Anchor          | Owns raw `<a>` when `href` provided              | wrapping `<button>`            |

## API contract
```ts
type MentionKind = "user" | "channel" | "project" | "team" | "custom";

interface MentionTokenProps extends HTMLAttributes<HTMLSpanElement> {
  kind: MentionKind;
  handle: string;              // raw handle (no prefix)
  label?: string;              // display name fallback
  href?: string;               // when navigable
  prefix?: string;             // override default prefix per `kind`
  tone?: "neutral" | "info" | "success";
}
```

## Required states
| State    | Behavior                                                          |
|----------|-------------------------------------------------------------------|
| default  | Prefix + handle/label rendered as a `Tag`                         |
| linked   | `href` provided → renders inside `<a>`; hover surfaces focus ring |
| unlinked | No `href` → rendered as a non-interactive token                   |
| current user | When `data-current="true"`, renders in the `info` tone        |

## Accessibility
- Prefix glyph included in textual content (so screen readers read "at cliff")
- Linked tokens render a real `<a href>`; non-linked tokens are non-focusable
- Tone is decorative; no semantic information conveyed by color alone

## Tokens
- Inherits surface tokens from `Tag`, typography from `Text`
- Adds: `--mention-token-gap`

## Do / Don't
```tsx
// DO
<MentionToken kind="user" handle="cliff" href="/users/cliff" />
<MentionToken kind="channel" handle="design-system" />

// DON'T — raw styled span
<span className="mention">@cliff</span>

// DON'T — Button as a mention
<Button variant="ghost">@cliff</Button>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `Tag` surface with prefix + handle/label for each `kind`
- `href` produces `<a>`; absence does not
- Prefix is part of accessible text content
- `tone` only changes color tokens
- Forwards ref; spreads remaining props onto root
- axe-core passes
