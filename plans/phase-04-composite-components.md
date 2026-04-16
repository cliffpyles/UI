# Phase 4: Composite Components

**Architecture Level:** Level 4 (Organisms)
**Dependencies:** Phase 3 (Base Components)
**Source of truth:** [design/architecture.md](../design/architecture.md) (Level 4 rules), [design/patterns/data-entry.md](../design/patterns/data-entry.md), [design/patterns/navigation-and-hierarchy.md](../design/patterns/navigation-and-hierarchy.md), [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md)

## Objective

Build composite components that solve recognizable UI problems by combining base components. These manage internal state, coordinate child behavior, and hide internal complexity behind clean APIs. They have no knowledge of application domain or data model.

## Components

### FormField

Combines label, input, error message, and hint text. Automatically links label to input via `htmlFor`/`id`.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `label` | `ReactNode` | required |
| `htmlFor` | `string` | auto-generated |
| `error` | `ReactNode` | — |
| `hint` | `ReactNode` | — |
| `required` | `boolean` | `false` |
| `children` | `ReactNode` (the input element) | required |

**Behavior:**
- Auto-generates matching `id` and `htmlFor` if not provided.
- Passes `aria-describedby` to the child input linking to error and hint elements.
- Error message uses `role="alert"` per [design/patterns/data-entry.md](../design/patterns/data-entry.md).
- Required indicator shows "(required)" text, not just an asterisk.

**Tests:**
- Label linked to input via htmlFor/id.
- Error message appears and is linked via aria-describedby.
- Hint text appears and is linked via aria-describedby.
- Required indicator rendered.
- axe-core passes with and without error.

### Dropdown

A rich dropdown menu with search, keyboard navigation, and custom option rendering. Compound component pattern.

**API:**
```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Options</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item onSelect={() => {}}>Edit</Dropdown.Item>
    <Dropdown.Item onSelect={() => {}}>Duplicate</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item onSelect={() => {}} variant="destructive">Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

**Behavior:**
- Opens on trigger click. Closes on outside click, Escape, or item selection.
- Keyboard: Arrow keys navigate items, Enter/Space selects, Escape closes.
- Focus trapped within dropdown while open. Focus returns to trigger on close.
- Uses `role="menu"` and `role="menuitem"`.
- Positioned below trigger by default, flips if clipped.

**Tests:**
- Opens and closes correctly (click, Escape, outside click).
- Keyboard navigation through items.
- Item selection fires onSelect and closes.
- Disabled items are skipped during keyboard navigation.
- Focus management (trap on open, return on close).
- Positioning (default and flipped).
- axe-core passes.

### Modal

A dialog that overlays the page. Focus is trapped within. Background is dimmed.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | required |
| `onClose` | `() => void` | required |
| `title` | `ReactNode` | — |
| `description` | `ReactNode` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `closeOnOverlayClick` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `children` | `ReactNode` | required |
| `footer` | `ReactNode` | — |

**Behavior:**
- Focus trapped within modal (Tab cycles through focusable elements).
- Escape closes (if `closeOnEscape`). Overlay click closes (if `closeOnOverlayClick`).
- Focus moves to first focusable element on open. Returns to trigger on close.
- Background scroll locked while open.
- Uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.

**Tests:**
- Opens and renders content. Closes correctly.
- Focus trap works (Tab cycles, shift+Tab cycles backward).
- Escape closes modal.
- Overlay click closes modal (and can be disabled).
- Focus returns to trigger element on close.
- Body scroll locked while open.
- ARIA attributes correct.
- axe-core passes.

### Card

A container for grouped content with optional header and footer slots.

**API:**
```tsx
<Card>
  <Card.Header>
    <Card.Title>Revenue</Card.Title>
    <Card.Actions><Button size="sm">Export</Button></Card.Actions>
  </Card.Header>
  <Card.Body>{children}</Card.Body>
  <Card.Footer>Updated 5 min ago</Card.Footer>
</Card>
```

**Tests:**
- Renders with header, body, footer slots.
- Each slot is optional.
- Applies correct background (raised surface), border, radius, shadow.
- axe-core passes.

### Tabs

Tab navigation for switching between peer-level content panels. Compound component.

**API:**
```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="details">Details</Tabs.Tab>
    <Tabs.Tab value="history" disabled>History</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="details">Details content</Tabs.Panel>
  <Tabs.Panel value="history">History content</Tabs.Panel>
</Tabs>
```

**Behavior:**
- Controlled (`value`/`onChange`) and uncontrolled (`defaultValue`).
- Keyboard: Arrow keys switch tabs, Tab moves focus into the active panel.
- Uses `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`.
- Only the active panel is rendered (lazy by default).

**Tests:**
- Switching tabs shows correct panel.
- Arrow key navigation between tabs.
- Disabled tabs are skipped.
- Controlled and uncontrolled modes.
- ARIA roles and relationships correct.
- axe-core passes.

### Accordion

Expandable/collapsible content sections. Compound component.

**API:**
```tsx
<Accordion type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

**Props (Accordion):**
| Prop | Type | Default |
|------|------|---------|
| `type` | `"single" \| "multiple"` | `"single"` |
| `value` | `string \| string[]` | — |
| `defaultValue` | `string \| string[]` | — |
| `onChange` | `(value) => void` | — |
| `collapsible` | `boolean` | `true` |

**Tests:**
- Single mode: only one item open at a time.
- Multiple mode: multiple items can be open.
- Keyboard: Enter/Space toggles item. Arrow keys navigate between triggers.
- Animation: expand/collapse uses `duration.normal`.
- ARIA: `aria-expanded`, `aria-controls`, `aria-labelledby`.
- axe-core passes.

### Pagination

Page navigation for paginated data.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `page` | `number` | required |
| `totalPages` | `number` | required |
| `onPageChange` | `(page: number) => void` | required |
| `pageSize` | `number` | — |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` |
| `onPageSizeChange` | `(size: number) => void` | — |
| `totalItems` | `number` | — |

Per [design/patterns/data-display.md](../design/patterns/data-display.md): shows "Showing X-Y of Z", page size selector, first/prev/next/last navigation.

**Tests:**
- Renders correct page range.
- Navigation buttons work (first, prev, next, last).
- Buttons disabled at boundaries (prev disabled on page 1, next disabled on last page).
- Page size selector changes page size.
- "Showing X-Y of Z" label is correct.
- Keyboard accessible.
- axe-core passes.

### SearchInput

Input with search icon, clear button, and search-as-you-type behavior.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | — |
| `defaultValue` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `onSearch` | `(value: string) => void` | — |
| `placeholder` | `string` | `"Search..."` |
| `debounce` | `number` (ms) | `300` |
| `loading` | `boolean` | `false` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |

Per [design/patterns/filtering-and-search.md](../design/patterns/filtering-and-search.md): search icon on the leading edge, X button to clear, debounced onChange.

**Tests:**
- Search icon renders.
- Clear button appears when value is non-empty.
- Clear button resets value and focuses input.
- Debounced onChange fires after delay.
- Escape key clears input.
- Loading state shows spinner replacing search icon.
- Controlled and uncontrolled.
- axe-core passes.

## Development Order

1. FormField (needed by all form compositions)
2. Modal (core overlay pattern)
3. Dropdown (complex keyboard + positioning)
4. Card (simple composition, used widely)
5. Tabs (compound component pattern)
6. Accordion
7. Pagination
8. SearchInput
9. Barrel exports + dev playground updates

## Testing Strategy

Composite component tests emphasize:

1. **Internal state management**: Open/closed, selected value, expanded/collapsed.
2. **Child coordination**: Label-input linking, tab-panel pairing, accordion item toggling.
3. **Complex keyboard**: Arrow navigation, focus trapping, Escape closing.
4. **Compound component API**: Subcomponents render correctly, shared state flows.
5. **Positioning** (Dropdown, Tooltip): Default placement, viewport flipping.
6. **Integration with base components**: Real base components used (not mocked).
7. **Accessibility**: Full ARIA pattern compliance, axe-core.

## Completion Criteria

- [x] All 8 composite components implemented.
- [x] All compound component APIs work (Dropdown, Tabs, Accordion, Card).
- [x] Modal focus trapping and scroll locking work correctly.
- [x] All keyboard interactions work per ARIA patterns.
- [x] All components support density and theming.
- [x] All components have comprehensive tests with axe-core.
- [x] Components exported from barrel files.
- [x] Dev playground updated with Composite Components section.
- [x] `npm run typecheck && npm run lint && npm test` passes.
