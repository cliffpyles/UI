---
name: Box
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["unstyled <div>", "<section>", "<article>", "<aside>", "<main>", "<nav>", "<header>", "<footer> used as layout containers"]
---

# Box

> The generic layout primitive — a polymorphic container exposing token-driven padding, gap, flex, surface, radius, and shadow.

## Purpose
Box is the canonical wrapper for layout. It removes the need for ad-hoc CSS files for every container that just needs flex, padding, or a surface color. By forcing all layout values through token-keyed props, it guarantees that spacing, color, radius, and shadow stay on the design system scale.

## When to use
- Any flex/stack container (`direction`, `align`, `justify`, `gap`)
- Padded regions, surface backgrounds, rounded cards-without-state
- Choosing a semantic landmark element (`as="section" | "nav" | "header" | …`)
- Flex-item concerns: `grow`, `shrink`, `wrap`, `minWidth={0}`

## When NOT to use
- A grid layout → use **Grid**
- A card with elevation, header, body conventions → use **Card** (Level 4)
- An interactive control → use **Button**, **Input**, etc.
- Typographic content → use **Text** (Box never renders text styling)

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Wrapper tag     | Owns raw `<div>` / landmark tags   | inline-style `<div>` outside Box   |
| Spacing values  | Token-keyed props only             | inline `style={{ padding: 12 }}`   |

## API contract
```ts
type BoxElement =
  | "div" | "section" | "article" | "aside"
  | "main" | "nav" | "header" | "footer";

type SpacingToken =
  | "0" | "px" | "0.5" | "1" | "1.5" | "2" | "2.5"
  | "3" | "3.5" | "4" | "5" | "6" | "7" | "8"
  | "10" | "12" | "14" | "16" | "20" | "24" | "32"
  | "content" | "section" | "inline" | "page";

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: BoxElement;
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  gap?: SpacingToken;
  display?: "flex" | "grid" | "block" | "inline-flex";
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  grow?: boolean | 0 | 1;
  shrink?: boolean | 0 | 1;
  minWidth?: 0 | "auto";
  background?: "surface" | "raised" | "sunken";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
}
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders the chosen element with computed inline styles + class hooks  |
| flex     | When any of `direction`/`align`/`justify`/`wrap` is set, `display` defaults to `"flex"` |

## Accessibility
- `as` must reflect the correct semantic landmark when used for page regions.
- Non-interactive — must not receive `onClick` handlers on a `<div>` rendering. If interactivity is needed, use a Button.

## Tokens
- Spacing: `--spacing-{0|px|0-5|1|1-5|2|2-5|3|3-5|4|5|6|7|8|10|12|14|16|20|24|32}`
- Semantic spacing: `--spacing-content-gap`, `--spacing-section-gap`, `--spacing-inline-gap`, `--spacing-page-padding`
- Background: `--color-background-{surface|surface-raised|surface-sunken}`
- Radius: `--radius-{none|sm|md|lg|xl|full}`
- Shadow: `--shadow-{none|sm|md|lg}`

## Do / Don't
```tsx
// DO
<Box as="section" padding="page" gap="content" direction="column" />

// DO — flex item shrinking to enable ellipsis
<Box minWidth={0} grow><Text truncate>{long}</Text></Box>

// DON'T — bypasses tokens
<div style={{ padding: 12, display: "flex" }} />

// DON'T — interactive
<Box onClick={handle}>Click me</Box>  // use Button
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` handlers on Box (use Button)
- Hardcoded color, spacing, radius, shadow values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders each `as` element correctly
- Each spacing prop emits the corresponding `var(--spacing-…)` (primitive and semantic)
- `direction`/`align`/`justify`/`wrap` defaults `display` to `flex`
- `grow`/`shrink`/`minWidth` emit correct inline styles
- Forwards ref; spreads remaining props
- axe-core passes
