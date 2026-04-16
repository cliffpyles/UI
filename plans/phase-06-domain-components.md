# Phase 6: Domain Components

**Architecture Level:** Level 5 (Domain)
**Dependencies:** Phase 4 (Composite Components), Phase 5 (Data Utilities & Display)
**Source of truth:** [design/architecture.md](../design/architecture.md) (Level 5 rules), [design/patterns/data-display.md](../design/patterns/data-display.md), [design/patterns/filtering-and-search.md](../design/patterns/filtering-and-search.md), [design/patterns/states.md](../design/patterns/states.md), [design/patterns/data-entry.md](../design/patterns/data-entry.md)

## Objective

Build domain-aware components that encode product-level conventions. These are the primary productivity multipliers — they understand data shapes, handle all states (loading, empty, error, stale), and enforce consistency for high-frequency patterns. They compose Level 3-4 components and never reference application-specific data fetching layers.

## Directory Structure

```
src/
  domain/                    # New directory
    DataTable/
      DataTable.tsx
      DataTable.css
      DataTable.test.tsx
      useDataTableState.ts   # Hook for sort/filter/pagination state
      index.ts
    MetricCard/
    StatusBadge/
    FilterBar/
    DateRangePicker/
    index.ts
```

## Components

### DataTable

The Level 5 table that wraps the generic Table (Level 4) with sort state, filter state, pagination, row selection, loading/empty/error states, and column configuration.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `columns` | `ColumnDef<T>[]` | required |
| `data` | `T[]` | required |
| `loading` | `boolean` | `false` |
| `error` | `ReactNode` | — |
| `onRetry` | `() => void` | — |
| `emptyState` | `ReactNode` | default EmptyState |
| `sortable` | `boolean` | `true` |
| `sort` | `{ column: string; direction: "asc" \| "desc" } \| null` | — |
| `onSortChange` | `(sort) => void` | — |
| `selectable` | `boolean` | `false` |
| `selectedRows` | `Set<string>` | — |
| `onSelectionChange` | `(selected: Set<string>) => void` | — |
| `getRowId` | `(row: T) => string` | — |
| `pagination` | `{ page: number; pageSize: number; total: number }` | — |
| `onPageChange` | `(page: number) => void` | — |
| `onPageSizeChange` | `(size: number) => void` | — |
| `stickyHeader` | `boolean` | `true` |
| `striped` | `boolean` | `true` |
| `onRowClick` | `(row: T) => void` | — |

**ColumnDef:**
```typescript
interface ColumnDef<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  width?: string | number;
  minWidth?: string | number;
  truncate?: boolean;
}
```

**State management:** Provide a `useDataTableState` hook that manages sort, pagination, and selection state locally, so consumers can use it without wiring up their own state:

```tsx
const table = useDataTableState({ defaultSort: { column: "name", direction: "asc" } });
<DataTable {...table.props} columns={columns} data={data} />
```

**States per [design/patterns/states.md](../design/patterns/states.md):**
- **Loading**: Skeleton rows matching column layout.
- **Empty (no data)**: Full-width EmptyState within table body.
- **Empty (no results)**: EmptyState with "No results match" and filter context.
- **Error**: ErrorState with retry button within table body.
- **Refreshing**: Existing data visible with subtle loading indicator in header.

**Tests:**
- Renders columns and rows from data.
- Sort: clicking header sorts, arrow indicators show direction, onSortChange fires.
- Selection: checkbox column appears, select all toggles current page, onSelectionChange fires.
- Pagination: integrates Pagination component, pages data correctly.
- Loading state: skeleton rows render.
- Empty state: EmptyState renders when data is [].
- Error state: ErrorState renders with retry.
- Row click fires onRowClick.
- Numeric columns right-aligned with tabular numerals.
- Sticky header works.
- All three density levels.
- axe-core passes (grid role, aria-sort, aria-selected).
- Edge cases: 0 columns, 1 row, 1000 rows (performance check), null cell values.

### MetricCard

Displays a single KPI per [design/patterns/data-display.md](../design/patterns/data-display.md) metric card anatomy.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | required |
| `value` | `number \| string \| null` | required |
| `format` | `"number" \| "currency" \| "percent" \| "compact" \| "custom"` | `"number"` |
| `formatOptions` | `FormatOptions` | — |
| `trend` | `{ value: number; direction: "up" \| "down" \| "flat"; label?: string }` | — |
| `sparkline` | `number[]` | — |
| `info` | `ReactNode` | — |
| `loading` | `boolean` | `false` |
| `error` | `ReactNode` | — |
| `onRetry` | `() => void` | — |

**Behavior:**
- Primary value rendered large and bold with tabular numerals.
- Uses `formatNumber`/`formatCurrency`/etc. from Phase 5 utilities.
- Trend indicator: ▲/▼/— icon + formatted value + optional comparison label. Color signals direction (green up, red down) but icon shape is the primary signal per [design/principles.md](../design/principles.md).
- Info tooltip (ℹ icon) per [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md).
- Loading: skeleton for value and trend, label remains visible.
- Error: label visible, value area shows compact error with retry.
- null value: shows "—".

**Tests:**
- Renders label and formatted value.
- Each format type applies correct formatter.
- Trend indicator shows correct icon and color.
- Info tooltip shows on hover/focus.
- Loading state: skeleton renders, label visible.
- Error state: error message with retry.
- Null value renders "—".
- Very large numbers use compact formatting.
- axe-core passes.

### StatusBadge

Maps a status string to a consistent visual representation (color + icon + label).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `status` | `string` | required |
| `statusMap` | `Record<string, StatusConfig>` | required |
| `size` | `"sm" \| "md"` | `"md"` |

**StatusConfig:**
```typescript
interface StatusConfig {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
  icon?: ReactNode;
}
```

**Behavior:**
- Renders a Badge with a Dot indicator (color) and the status label.
- Icon provides the secondary signal (non-color) per accessibility requirements.
- Unknown status values render as neutral with the raw status string.

**Tests:**
- Renders correct label, color, and icon for each status in the map.
- Unknown status renders as neutral fallback.
- Dot color matches variant.
- axe-core passes.

### FilterBar

A horizontal bar of filter controls with active filter display per [design/patterns/filtering-and-search.md](../design/patterns/filtering-and-search.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `filters` | `FilterDef[]` | required |
| `values` | `Record<string, unknown>` | required |
| `onChange` | `(values: Record<string, unknown>) => void` | required |
| `onClear` | `() => void` | — |

**FilterDef:**
```typescript
interface FilterDef {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "daterange" | "search";
  options?: Array<{ value: string; label: string; count?: number }>;
  placeholder?: string;
}
```

**Behavior:**
- Renders filter controls horizontally (scrollable if overflows).
- Active filters shown as removable Tag chips below the filter bar.
- "Clear all" action visible when any filter is active.
- Active filter count shown.
- Filter controls use Phase 3-4 components (Select, SearchInput, DateRangePicker).

**Tests:**
- Renders filter controls from definitions.
- Changing a filter fires onChange with updated values.
- Active filters appear as removable chips.
- Removing a chip clears that filter.
- "Clear all" resets all filters.
- Handles empty filter values gracefully.
- axe-core passes.

### DateRangePicker

A specialized input for selecting start and end dates with preset ranges.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `{ start: Date; end: Date } \| null` | — |
| `onChange` | `(range: { start: Date; end: Date } \| null) => void` | required |
| `presets` | `Array<{ label: string; range: { start: Date; end: Date } }>` | common presets |
| `minDate` | `Date` | — |
| `maxDate` | `Date` | — |
| `disabled` | `boolean` | `false` |

**Presets (default):** Last 7 days, Last 30 days, Last 90 days, This month, Last month, This year.

**Behavior:**
- Opens a popover with two month calendars (start and end).
- Preset buttons for quick selection.
- Validates start < end.
- Display format follows locale via `formatDate`.

**Tests:**
- Selecting start then end date fires onChange.
- Preset selection fires onChange with correct range.
- Validation: start must be before end.
- minDate/maxDate constraints disable out-of-range dates.
- Keyboard navigation through calendar days.
- Closing popover returns focus to trigger.
- axe-core passes.

## Development Order

1. StatusBadge (simplest, wraps Badge + Dot)
2. MetricCard (self-contained, demonstrates formatter integration)
3. DateRangePicker (complex but independent)
4. FilterBar (depends on Select, SearchInput, DateRangePicker)
5. DataTable (most complex, depends on Table, Pagination, EmptyState, ErrorState)
6. Barrel exports + dev playground updates

## Testing Strategy

Domain component tests emphasize:

1. **State coverage**: Every component tested in all states — loading, empty, error, data, stale.
2. **Formatter integration**: Verify correct formatting functions are used, including edge cases.
3. **Data edge cases**: Null values, empty arrays, very large datasets (for DataTable).
4. **Accessibility**: Color is never the sole indicator. Icons and text always supplement color.
5. **Integration**: Uses real lower-level components, not mocks.
6. **Consumer API**: `useDataTableState` hook tested independently.

## Completion Criteria

- [ ] All 5 domain components implemented.
- [ ] DataTable supports sort, selection, pagination, and all states.
- [ ] `useDataTableState` hook provides convenient state management.
- [ ] MetricCard integrates with all format utilities.
- [ ] FilterBar composes filter controls and manages active filter display.
- [ ] DateRangePicker supports presets, min/max, and keyboard navigation.
- [ ] StatusBadge never relies on color alone for meaning.
- [ ] All components handle null/empty/error data gracefully.
- [ ] All components support density and theming.
- [ ] All components have comprehensive tests with axe-core.
- [ ] Components exported from `src/domain/index.ts` and `src/index.ts`.
- [ ] Dev playground updated with Domain Components section.
- [ ] `npm run typecheck && npm run lint && npm test` passes.
