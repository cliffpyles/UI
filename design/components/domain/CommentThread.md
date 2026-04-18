---
name: CommentThread
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, UserChip, UserAvatar, Text, Textarea, Button]
---

# CommentThread

> A threaded discussion with author chips, mentions, reactions, and an inline reply composer.

## Purpose
CommentThread owns the conversation surface that appears in review tools, ticketing, design feedback, and analytics annotations. It standardizes author rendering, indentation rules for replies, the mention rendering, the reaction row, and the composer affordance — all of which teams otherwise reinvent inconsistently. It does not own persistence or mention resolution; consumers pass handlers.

## When to use
- Threaded comments on an entity (issue, doc, dashboard, design)
- Inline conversation panels in review or approval flows
- Annotation threads attached to a row, chart, or asset

## When NOT to use
- Single-author timelines → use **ActivityFeed** with **ActivityItem**
- Field-level diff history → use **ChangeLog**
- Notifications / system events → use **ActivityFeed**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for thread; nested `Box` per comment with `Box direction="row" gap` for avatar + body | hand-rolled flex / padding in CSS |
| Author identity (header) | `UserChip`                  | inline avatar + name JSX             |
| Avatar (large, on body indent) | `UserAvatar`           | raw `<img>` with avatar CSS          |
| Comment body    | `Text` (one per paragraph or block)  | raw `<p>` with typography CSS        |
| Reply composer  | `Textarea`                           | raw `<textarea>`                     |
| Submit / reaction buttons | `Button variant="ghost"`   | raw `<button>`                       |

## API contract
```ts
interface CommentNode {
  id: string;
  author: { id: string; name: string; avatarUrl?: string };
  body: ReactNode;                      // already-rendered content (mentions resolved)
  createdAt: Date | string;
  reactions?: { emoji: string; count: number; reactedByMe?: boolean }[];
  replies?: CommentNode[];
}

interface CommentThreadProps extends HTMLAttributes<HTMLElement> {
  comments: CommentNode[];
  currentUser?: { id: string; name: string; avatarUrl?: string };
  onSubmit?: (body: string, parentId: string | null) => void;
  onReact?: (commentId: string, emoji: string) => void;
  maxDepth?: number;                    // default 3
  loading?: boolean;
}
```
Renders as `<section>`; forwards ref to it.

## Required states
| State    | Behavior                                                                 |
|----------|--------------------------------------------------------------------------|
| empty    | Composer-only rendering when `comments` is empty                         |
| default  | Top-level comments rendered with `UserChip` header, indented replies     |
| nested   | Replies indented up to `maxDepth`; deeper nesting flattens to `maxDepth` |
| composing| `Textarea` + submit `Button` rendered at thread end and per-comment reply|
| loading  | Skeletons inside the comment list; `aria-busy="true"` on root            |

## Accessibility
- Root `<section>` with `aria-label="Comments"`
- Each comment is `role="article"` with `aria-labelledby` pointing at the author chip
- Reaction `Button`s expose `aria-pressed` for `reactedByMe` state
- Composer `Textarea` has a labeled accessible name ("Reply to <author>" or "New comment")

## Tokens
- Inherits all tokens from `UserChip`, `UserAvatar`, `Text`, `Textarea`, `Button`
- Adds (component tier): `--comment-thread-indent-step`, `--comment-thread-row-gap`

## Do / Don't
```tsx
// DO
<CommentThread comments={comments} currentUser={me} onSubmit={post} onReact={react} />

// DON'T — render avatar / name inline
<img src={c.author.avatarUrl} className="avatar"/>{c.author.name}

// DON'T — bake in mention resolution
{body.replace(/@\w+/g, m => <a href={…}>{m}</a>)}    // resolve before passing in
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Raw `<img>` for avatars (use `UserAvatar`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Top-level comments render with author `UserChip` and body `Text`
- Replies indent up to `maxDepth`; deeper trees flatten to that depth
- Composer submit invokes `onSubmit(body, parentId)`
- Reaction click invokes `onReact(commentId, emoji)` and `aria-pressed` toggles
- `loading` shows skeletons and `aria-busy`
- Forwards ref; spreads remaining props onto root `<section>`
- Composition probe: `UserChip`, `UserAvatar`, `Textarea`, `Button` all render inside output
- axe-core passes in empty, default, nested, loading
