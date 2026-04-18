---
name: Accordion
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: [navigation-and-hierarchy]
uses: [Box, Text, Button, Icon]
replaces-raw: ["<button> with hand-rolled aria-expanded", "inline <svg> chevron"]
---

# Accordion

> A vertically stacked set of expandable sections, each with a heading that toggles its panel.

## Purpose
Accordion lets the user reveal or hide chunks of secondary content without leaving the page — useful for FAQs, settings groups, and progressive disclosure of dense information. It owns the single/multiple expansion model, controlled/uncontrolled state, the `aria-expanded`/`aria-controls` wiring, and the keyboard model (Arrow keys move between triggers, Home/End jump). Compound sub-components (`Accordion.Item`, `Accordion.Trigger`, `Accordion.Content`) make the structure explicit while sharing state through context.

## When to use
- FAQ-style lists where most entries stay collapsed
- Grouped settings sections where users review one at a time
- Long-form content that benefits from progressive disclosure
- Sidebars where each section's contents are independent

## When NOT to use
- Mutually exclusive views of related content — use **Tabs**
- Required form fields — never hide required input behind a collapsed panel
- A single section — use a heading + content
- Tree navigation with parent/child relationships — use a tree component

## Composition (required)
| Concern             | Use                                          | Never                                        |
|---------------------|----------------------------------------------|----------------------------------------------|
| Root + item layout  | `Box display="flex" direction="column">`     | raw `<div>` with flex CSS                    |
| Heading wrapper     | `Text as="h3">` around the trigger Button    | raw `<h3>` with typography CSS               |
| Trigger             | `Button variant="ghost" size="md">` full-width | raw `<button>` with manual focus styles    |
| Trigger label       | `Text>` (inside the trigger Button)          | inline-styled `<span>`                       |
| Chevron             | `Icon name="chevron-down">`                  | inline `<svg>`                               |
| Panel container     | `Box>`                                       | raw `<div>` with padding CSS                 |

The trigger and chevron are the most likely places this composition is bypassed today. The ideal implementation routes the trigger through `Button` (already owns focus ring, hover/active tokens) and the glyph through `Icon` (already owns sizing and color tokens).

## API contract
```ts
type AccordionType = "single" | "multiple";

interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  type?: AccordionType;             // default "single"
  value?: string | string[];        // controlled
  defaultValue?: string | string[]; // uncontrolled
  onChange?: (value: string | string[]) => void;
  collapsible?: boolean;            // default true (single mode)
  children: ReactNode;
}

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

type AccordionTriggerProps = HTMLAttributes<HTMLButtonElement>;
type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

// Compound: Accordion.Item, Accordion.Trigger, Accordion.Content
```

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| collapsed      | Panel hidden via `hidden` attribute; chevron points down              |
| expanded       | Panel visible; chevron rotated; `aria-expanded="true"` on trigger     |
| single mode    | Opening one item collapses any other open item                        |
| multiple mode  | Items expand and collapse independently                               |
| not collapsible | `type="single"` + `collapsible={false}` → cannot close the open item |
| keyboard       | ArrowUp/Down move focus between triggers; Home/End jump               |

## Accessibility
- Each trigger is wrapped in a heading (`Text as="h3">`) so the document outline reflects the structure.
- Trigger carries `aria-expanded` and `aria-controls` pointing at the panel id.
- Panel uses `role="region"` with `aria-labelledby` pointing at the trigger id.
- The chevron is `aria-hidden="true"` — the trigger's accessible name is the label text.

## Tokens
- Item border: `--color-border-default`
- Trigger padding: `--accordion-trigger-padding-{x|y}`
- Trigger hover: inherited from `Button` ghost variant
- Chevron rotation duration: `--duration-fast`
- Content padding: `--accordion-content-padding-{x|y}`

## Do / Don't
```tsx
// DO
<Accordion type="single" defaultValue="billing">
  <Accordion.Item value="billing">
    <Accordion.Trigger>Billing</Accordion.Trigger>
    <Accordion.Content>{…}</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="security">
    <Accordion.Trigger>Security</Accordion.Trigger>
    <Accordion.Content>{…}</Accordion.Content>
  </Accordion.Item>
</Accordion>

// DON'T — inline svg chevron
<button>Billing <svg>…</svg></button>

// DON'T — hiding required form fields behind an Accordion
<Accordion><Accordion.Item><FormField required label="Email">…</FormField></Accordion.Item></Accordion>
```

## Forbidden patterns (enforced)
- Raw `<button>` for the trigger (use `Button`)
- Raw `<svg>` for the chevron (use `Icon`)
- Raw styled `<h3>` / `<span>` (use `Text`)
- Hand-rolled flex CSS (use `Box`)
- Hardcoded color, spacing, duration values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `type="single"` collapses other items when one opens
- `type="multiple"` allows independent expansion
- `collapsible={false}` prevents closing the only open item in single mode
- ArrowUp/Down/Home/End move focus between triggers
- Panel `hidden` attribute reflects expanded state
- Trigger `aria-expanded` and panel `role="region"` + `aria-labelledby` are correct
- Composition probe: `Button` renders the trigger; `Icon` renders the chevron
- axe-core passes in collapsed and expanded states
