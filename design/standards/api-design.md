# Component API Design

The design system needs to be as useful to engineers as to designers. API design determines whether components are adopted eagerly or worked around. These guidelines apply to all components at Levels 2-6.

## Core Principles

### 1. Small Surface Area

A component's prop list should be as small as possible while covering its use cases. Every prop is a commitment to maintain.

**Rule of thumb:** If a prop is only used in one place across the entire application, it probably belongs on a wrapper component, not the base component.

### 2. Consistent Naming

Props with the same semantic meaning use the same name across all components:

| Concept | Prop name | Type | Not |
|---------|-----------|------|-----|
| Visual variant | `variant` | string literal union | `type`, `kind`, `style`, `appearance` |
| Size | `size` | `"sm" \| "md" \| "lg"` | `small`, `isLarge`, `sizing` |
| Disabled state | `disabled` | `boolean` | `isDisabled` |
| Loading state | `loading` | `boolean` | `isLoading` |
| Children content | `children` | `ReactNode` | `content`, `text`, `label` (for primary content) |
| Change handler | `onChange` | `(value) => void` | `onValueChange`, `handleChange` |
| Additional class | `className` | `string` | `class`, `classes`, `style` |

### 3. String Unions Over Booleans

When a prop represents one of several options, use a string union — not a boolean.

```tsx
// Do: explicit, extensible
variant: "primary" | "secondary" | "ghost"

// Don't: implicit, not extensible
isPrimary?: boolean
isSecondary?: boolean
```

Booleans only when the concept is genuinely binary: `disabled`, `loading`, `required`.

### 4. Extend HTML Attributes

Components that render a specific HTML element extend that element's attributes:

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}
```

This automatically supports `onClick`, `disabled`, `aria-label`, `data-testid`, and every other native attribute without the component explicitly declaring each one.

### 5. Forward Refs

Every component that renders a DOM element forwards its ref:

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={...} {...props}>
        {children}
      </button>
    );
  }
);
```

### 6. Spread Remaining Props

After extracting component-specific props, spread the rest onto the root DOM element:

```tsx
const { variant, size, className, children, ...props } = allProps;
return <button {...props}>{children}</button>;
```

This ensures consumers can add event handlers, data attributes, and ARIA properties without the component needing to anticipate them.

## Composition Patterns

### Compose from lower-level primitives

Components must build on the primitives and base components beneath them rather than reimplementing those concerns with raw HTML + CSS.

- Render typographic content (`h1`-`h6`, `p`, `label`, `legend`, styled `span`) through [`Text`](../../src/primitives/Text/Text.tsx) — use `as="h3"`, `size`, `weight`, `color` instead of custom typography classes.
- Render flex/stack containers through [`Box`](../../src/primitives/Box/Box.tsx) when semantics allow.
- If a primitive is missing for a recurring need, add one — do not inline the raw implementation.

See [Architecture → Composition-first rule](../architecture.md) for the full policy.

### Slots Over Configuration Props

When a component accepts variable content, use a slot pattern:

```tsx
// Do: flexible, composable
<Card
  header={<CardHeader title="Revenue" action={<Button size="sm">Export</Button>} />}
  footer={<CardFooter>Updated 5 min ago</CardFooter>}
>
  {children}
</Card>

// Don't: rigid, limited
<Card
  title="Revenue"
  showExportButton
  onExport={handleExport}
  footerText="Updated 5 min ago"
>
  {children}
</Card>
```

### Compound Components

For tightly coupled component groups that share implicit state:

```tsx
<Select value={value} onChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="a">Option A</Select.Item>
    <Select.Item value="b">Option B</Select.Item>
  </Select.Content>
</Select>
```

**Use when:** Components always appear together and share state (Tabs, Select, Accordion, Menu).

### Render Props

For components that need to customize how items are rendered:

```tsx
<DataTable
  data={users}
  columns={columns}
  renderRow={(row, index) => (
    <TableRow key={row.id} highlighted={row.isNew}>
      {columns.map(col => <TableCell key={col.key}>{col.render(row)}</TableCell>)}
    </TableRow>
  )}
/>
```

**Use when:** The component manages behavior (sorting, virtualization) but consumers control rendering.

## Prop Patterns

### Controlled vs. Uncontrolled

All input components support both controlled and uncontrolled usage:

```tsx
// Controlled: parent manages state
<Input value={value} onChange={setValue} />

// Uncontrolled: component manages its own state
<Input defaultValue="initial" />
```

When both `value` and `defaultValue` are provided, `value` takes precedence (controlled mode).

### Polymorphic `as` Prop

Some components render as different HTML elements depending on context:

```tsx
<Button as="a" href="/dashboard">Dashboard</Button>  // Renders <a>
<Button as="button" onClick={handleClick}>Save</Button>  // Renders <button>
```

Use sparingly — only for components where the rendered element genuinely varies (Button, Text, Box).

### Layout via Box

Flex stacks belong on the `Box` primitive, not on per-component `display: flex` declarations. When a component needs to line up children horizontally or vertically, compose `Box` instead of spinning up bespoke flex CSS.

```tsx
// Do: layout is expressed in the markup, stylesheet stays focused on visuals
<Box display="flex" align="center" justify="between" gap="3">
  <CardTitle />
  <CardActions />
</Box>

// Don't: duplicate flex primitives in every component stylesheet
<div className="ui-card__header">…</div>
// .ui-card__header { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-3); }
```

Box covers the common axis props (`display`, `direction`, `align`, `justify`, `gap`), sizing (`padding`, `paddingX`, `paddingY`), and the flex-item escape hatches (`wrap`, `grow`, `shrink`). Reach for a stylesheet only when the layout needs something Box can't express — grid templates, responsive breakpoints, or density-specific overrides that must defeat inline styles.

### Event Handler Conventions

- Named `on{Event}`: `onClick`, `onChange`, `onSelect`, `onDismiss`.
- Receive the value or event as the first argument, not wrapped in an object.
- For components that manage lists: `onSelect(item)` not `onSelect({ selectedItem: item })`.

## Versioning & Breaking Changes

### What Constitutes a Breaking Change

- Removing a prop.
- Changing a prop's type.
- Changing default behavior.
- Renaming a component or its exports.
- Changing the rendered DOM structure in a way that breaks consumer CSS selectors.

### What Is Not a Breaking Change

- Adding a new optional prop.
- Adding a new variant option.
- Fixing a bug in behavior.
- Changing internal implementation without API change.

### Migration Support

When a breaking change is necessary:
1. Deprecate the old API in a minor release: add a console warning, update documentation.
2. Maintain both old and new API for at least one minor version.
3. Provide a codemod or migration guide for the change.
4. Remove the old API in the next major release.
