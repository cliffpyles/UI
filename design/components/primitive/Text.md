---
name: Text
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["<h1>", "<h2>", "<h3>", "<h4>", "<h5>", "<h6>", "<p>", "<label>", "<legend>", "styled <span>"]
---

# Text

> The polymorphic typography primitive — every visible string of text in the system flows through it.

## Purpose
Text owns typography. It enforces token-driven font size, weight, color, family, and alignment, and offers ergonomic affordances for truncation and tabular numerals. By being the only path to styled text, it guarantees theme/density propagation and prevents drift in the type scale.

## When to use
- Any heading, paragraph, label, legend, or styled span
- Inline text that needs a semantic token color (`secondary`, `success`, `error`, …)
- Numbers in tables/metrics that need `tabularNums`
- Single-line ellipsis truncation (`truncate` — auto-sets `title` from a string child)

## When NOT to use
- Form-control association wrapper `<label htmlFor=…>` that must remain a real `<label>` for click target → render the `<label>` natively but wrap the visible string in `Text as="span">` if it carries styling
- Decorative non-text content → use **Icon**
- Long-form rich text from a CMS → render via the CMS-aware component

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<h1>`–`<h6>`/`<p>`/`<label>`/`<legend>`/styled `<span>` | raw typographic tags in `components/`/`domain/`/`layouts/` |
| Font/color     | `size`/`weight`/`color`/`family` props | hardcoded `font-size`/`color` CSS |

## API contract
```ts
type TextElement =
  | "span" | "p"
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "label" | "legend";

type TextSize =
  | "2xs" | "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  | "body" | "caption" | "label";

type TextWeight = "normal" | "medium" | "semibold" | "bold";

type TextColor =
  | "primary" | "secondary" | "tertiary" | "disabled"
  | "success" | "warning" | "error" | "inherit";

type TextAlign = "start" | "center" | "end";
type TextFamily = "sans" | "mono";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;        // default "span"
  size?: TextSize;          // default "base"
  weight?: TextWeight;      // default "normal"
  color?: TextColor;        // default "primary"
  truncate?: boolean;       // default false
  tabularNums?: boolean;    // default false
  align?: TextAlign;
  family?: TextFamily;      // default "sans"
}
```

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| default      | Token-driven font size/weight/color/family                        |
| truncate     | `overflow:hidden`, `text-overflow:ellipsis`, `white-space:nowrap`; sets `title` from string children when `title` is not already provided |
| tabularNums  | `font-variant-numeric: tabular-nums`                              |

## Accessibility
- `as` MUST match document semantics — never use `as="h1"` for visual styling alone.
- `truncate` requires the parent flex chain to permit shrinking (typically `Box minWidth={0}`); the auto-title mirror lets the full content remain reachable on hover.
- Color is theme-resolved; do not rely on color alone to convey meaning.

## Tokens
- Font sizes: `--font-size-{2xs|xs|sm|base|lg|xl|2xl|3xl|4xl}` and semantic `--font-size-{body|caption|label}`
- Line heights: `--font-line-height-{tight|normal}`
- Weights: `--font-weight-{normal|medium|semibold|bold}`
- Colors: `--color-text-{primary|secondary|tertiary|disabled}`, `--color-status-{success|warning|error}-text`
- Families: `--font-family-{sans|mono}`

## Do / Don't
```tsx
// DO
<Text as="h2" size="xl" weight="semibold">Section title</Text>
<Text size="caption" color="secondary">Updated 2m ago</Text>
<Text truncate>{longName}</Text>

// DON'T — raw typographic tag in a non-primitive component
<h2 className="title">Section title</h2>

// DON'T — inline font CSS
<span style={{ fontSize: 14, color: "#666" }}>…</span>

// DON'T — semantic heading chosen for size, not document structure
<Text as="h1">Just a big label</Text>
```

## Forbidden patterns (enforced)
- Raw `<h1>`–`<h6>`, `<p>`, `<legend>`, styled `<span>` in `components/`, `domain/`, `layouts/`, `features/` (Text owns these)
- Hardcoded font size, color, line-height, weight
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `as` renders the correct tag
- Each size/weight/color/family/align emits the correct class
- `truncate` adds the truncate class and `title` mirrors string children
- `tabularNums` adds the tabular-nums class
- Forwards ref; spreads remaining props
- axe-core passes for representative compositions
