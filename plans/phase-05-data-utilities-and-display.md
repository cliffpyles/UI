# Phase 5: Data Utilities & Display

**Architecture Level:** Level 3-4 (Base + Composite)
**Dependencies:** Phase 3 (Base Components). Can be developed in parallel with Phase 4.
**Source of truth:** [design/patterns/data-display.md](../design/patterns/data-display.md), [design/patterns/states.md](../design/patterns/states.md), [design/patterns/error-handling.md](../design/patterns/error-handling.md), [design/foundations/typography.md](../design/foundations/typography.md), [design/standards/internationalization.md](../design/standards/internationalization.md)

## Objective

Build the data formatting utilities and data-display components that data-intensive applications depend on. This includes centralized formatters for numbers, dates, and currencies, plus the generic Table (Level 4), EmptyState, ErrorState, and ProgressBar components. These are prerequisites for the domain components in Phase 6.

## Deliverables

### 1. Formatting Utilities

Centralized formatting functions per [design/patterns/data-display.md](../design/patterns/data-display.md) and [design/standards/internationalization.md](../design/standards/internationalization.md). All formatters use `Intl` APIs and accept a locale parameter (defaulting to the user's locale).

```
src/
  utils/
    format/
      number.ts
      currency.ts
      percent.ts
      date.ts
      duration.ts
      bytes.ts
      compact.ts
      index.ts
    index.ts
```

**`formatNumber(value, options?)`**
- Thousands separator per locale.
- Configurable decimal precision.
- Handles null/undefined → returns `"—"`.
- Handles NaN → returns `"—"`.

**`formatCompact(value, options?)`**
- Compact notation: 1.2K, 3.4M, 1.2B.
- Uses `Intl.NumberFormat` with `notation: "compact"`.

**`formatCurrency(value, currency, options?)`**
- Symbol placement per locale.
- Decimal rules per currency.

**`formatPercent(value, options?)`**
- Fixed precision (default 1 decimal).
- Optional sign (+/-).

**`formatDate(value, options?)`**
- Relative when recent per [design/foundations/typography.md](../design/foundations/typography.md): "Just now", "5 min ago", "3 days ago".
- Absolute when older: "Mar 15" or "Mar 15, 2024" (different year).
- Full date+time available via `format: "full"` option.

**`formatDuration(ms, options?)`**
- Human-readable: "2h 15m", "3d 4h".
- Compact: "2:15:00".

**`formatBytes(bytes, options?)`**
- KB, MB, GB with appropriate precision.

**Tests for each formatter:**
- Correct output for typical values.
- Locale-specific formatting (test with en-US, de-DE at minimum).
- Edge cases: 0, negative numbers, very large numbers (1e12+), NaN, null, undefined.
- Return `"—"` (em dash) for null/undefined/NaN, not empty string or "NaN".

### 2. Table (Level 4, Generic)

A generic, unstyled-logic table component. Not the domain-aware DataTable (Phase 6) — this is the structural foundation that DataTable will wrap.

**API:**
```tsx
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head sortable sorted="asc" onSort={() => {}}>Name</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head numeric>Revenue</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Acme Corp</Table.Cell>
      <Table.Cell>Active</Table.Cell>
      <Table.Cell numeric>$1,234,567</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={3}>3 items</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table>
```

**Table.Head props:**
| Prop | Type | Default |
|------|------|---------|
| `sortable` | `boolean` | `false` |
| `sorted` | `"asc" \| "desc" \| false` | `false` |
| `onSort` | `() => void` | — |
| `numeric` | `boolean` | `false` |
| `sticky` | `boolean` | `false` |
| `width` | `string \| number` | — |

**Table.Cell props:**
| Prop | Type | Default |
|------|------|---------|
| `numeric` | `boolean` | `false` |
| `truncate` | `boolean` | `false` |
| `colSpan` | `number` | — |

**CSS:** Per [design/patterns/data-display.md](../design/patterns/data-display.md):
- Semantic HTML: `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<th scope="col">`.
- Sticky header via `position: sticky`.
- Numeric cells use `text-align: end` and `font-variant-numeric: tabular-nums`.
- Striped rows (alternating background) via CSS `:nth-child`.
- Row hover highlight.
- Density support: row heights 32px (compact), 44px (default), 56px (comfortable).

**Tests:**
- Renders semantic HTML (table, thead, tbody, th with scope).
- Sort indicators appear on sortable columns.
- onSort fires on header click.
- Numeric cells right-aligned with tabular numerals.
- Sticky header works (CSS class applied).
- Truncated cells show ellipsis.
- `aria-sort` attribute on sorted columns.
- Keyboard: Enter on sortable header triggers sort.
- Density variants render correct row heights.
- axe-core passes.

### 3. EmptyState

A reusable component for displaying empty content states per [design/patterns/states.md](../design/patterns/states.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `variant` | `"no-data" \| "no-results" \| "error" \| "first-use" \| "restricted"` | `"no-data"` |
| `title` | `string` | required |
| `description` | `ReactNode` | — |
| `icon` | `ReactNode` | variant-derived default |
| `action` | `ReactNode` | — |

**Tests:**
- Renders title and description.
- Correct default icon per variant.
- Action button renders and is clickable.
- No a11y violations.

### 4. ErrorState

A reusable component for error display within a component or section boundary per [design/patterns/error-handling.md](../design/patterns/error-handling.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | `"Something went wrong"` |
| `description` | `ReactNode` | — |
| `onRetry` | `() => void` | — |
| `retrying` | `boolean` | `false` |
| `details` | `string` | — |

**Behavior:**
- Shows error icon, title, description.
- Retry button (if `onRetry` provided) with loading state.
- Collapsible "Show details" section for technical info.

**Tests:**
- Renders title and description.
- Retry button fires onRetry.
- Retrying state shows spinner on retry button.
- Details section is collapsed by default, expands on click.
- `role="alert"` on the container.
- axe-core passes.

### 5. ProgressBar

Determinate and indeterminate progress indicator.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `number` (0-100) | — |
| `max` | `number` | `100` |
| `variant` | `"default" \| "success" \| "warning" \| "error"` | `"default"` |
| `size` | `"sm" \| "md"` | `"md"` |
| `label` | `string` | — |
| `showValue` | `boolean` | `false` |

When `value` is undefined, renders an indeterminate animation.

**Tests:**
- Determinate: width matches value percentage.
- Indeterminate: animation class applied when no value.
- `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Label renders with `aria-label`.
- Variant colors applied correctly.
- axe-core passes.

## Development Order

1. Formatting utilities (no component dependencies)
2. EmptyState (simple, needed by Table)
3. ErrorState (simple, needed by Table)
4. ProgressBar
5. Table (depends on EmptyState for empty rows)
6. Barrel exports + dev playground updates

## Testing Strategy

### Formatter Tests

Each formatter has its own test file with:
- Standard values (positive integers, decimals, zero).
- Boundary values (very large, very small, negative).
- Null/undefined/NaN handling (all return `"—"`).
- Locale variations (en-US vs de-DE vs ja-JP).
- Type safety: TypeScript catches invalid inputs at compile time.

### Component Tests

Standard component test pattern plus data-specific edge cases:

```typescript
describe("Table", () => {
  it("renders with empty data", () => { /* shows EmptyState */ });
  it("renders with single row", () => { ... });
  it("renders with many columns (horizontal overflow)", () => { ... });
  it("aligns numeric cells to the end", () => { ... });
  it("sorts ascending then descending on header click", () => { ... });
  it("handles very long cell content with truncation", () => { ... });
  it("renders at compact density with 32px row height", () => { ... });
  it("renders at comfortable density with 56px row height", () => { ... });
});
```

## Completion Criteria

- [ ] All 6 formatting utilities implemented with full locale support.
- [ ] All formatters handle edge cases (null, undefined, NaN, extremes).
- [ ] Table component renders semantic HTML with correct ARIA.
- [ ] Table supports sorting, sticky header, numeric alignment, truncation.
- [ ] Table supports all three density levels.
- [ ] EmptyState covers all 5 variant types.
- [ ] ErrorState supports retry with loading state and detail expansion.
- [ ] ProgressBar supports determinate and indeterminate modes.
- [ ] All components have comprehensive tests with axe-core.
- [ ] Everything exported from barrel files.
- [ ] Dev playground updated with Data Display section.
- [ ] `npm run typecheck && npm run lint && npm test` passes.
