# Filtering & Search

Data exploration is a core workflow in data-intensive applications. The system supports three distinct interaction models for narrowing data, each appropriate for different levels of user expertise and query complexity.

## Interaction Models

### Simple Search

A single text input that searches across all relevant fields.

- Always visible, prominently placed.
- Search-as-you-type with debouncing (300ms).
- Shows result count: "12 results for 'quarterly'".
- Clear button (X) to reset search.
- Highlights matching text in results when feasible.

**Use when:** Users want to find a known item quickly. The dataset has a natural "name" or "title" field.

### Structured Filters

Predefined filter controls (dropdowns, date pickers, toggles) for known data dimensions.

```
┌─────────────────────────────────────────────────────────┐
│ Status: [All ▼]  Type: [All ▼]  Date: [Last 30 days ▼] │  ← Filter bar
│ ✕ Active  ✕ Created after Mar 1                        │  ← Active filter chips
└─────────────────────────────────────────────────────────┘
```

- Filter bar is horizontally scrollable if it overflows.
- Each filter shows its label and current value.
- Active filters are also displayed as removable chips below the filter bar.
- "Clear all filters" action is visible whenever any filter is active.
- Results update immediately on filter change (no "Apply" button needed for simple filters).

**Use when:** The data has well-defined, bounded dimensions. Most users will filter by the same 3-5 attributes.

### Query Builder

A visual interface for building complex, multi-condition queries with AND/OR logic.

```
┌─────────────────────────────────────────────────────┐
│ Where:                                              │
│   [Status ▼] [is ▼] [Active ▼]                     │
│   AND                                               │
│   [Revenue ▼] [is greater than ▼] [10000    ]       │
│   [+ Add condition]  [+ Add group]                  │
│                                              [Apply]│
└─────────────────────────────────────────────────────┘
```

- Condition rows: field selector → operator selector → value input.
- Operators change based on field type (text: contains/equals/starts with; number: equals/greater/less; date: before/after/between).
- AND/OR grouping with visual nesting.
- "Apply" button required (complex queries should not execute on every keystroke).
- Query can be saved as a named view.

**Use when:** Power users need to express complex criteria. The dataset has many dimensions. Ad-hoc analysis is a primary use case.

## Active Filter Display

When filters are active, the user must always know what they're looking at:

- **Filter summary**: A visible indicator showing the number of active filters and their values.
- **Removable chips**: Each active filter appears as a chip that can be removed individually.
- **Empty state awareness**: When filters produce zero results, the empty state says "No results match your filters" and shows the active filters with an option to clear them.
- **Count context**: Results always show "X of Y items" to make clear that filtering is in effect.

## Faceted Search

Filter options show counts that update dynamically based on current results:

```
Status:
  ● Active (234)
  ○ Inactive (12)
  ○ Pending (45)
  ○ Archived (0)    ← Greyed out (zero results)
```

- Counts update as other filters change.
- Zero-count options are shown but disabled/greyed — not hidden — so users can see the full dimension space.
- Facets are sorted by count (highest first) or alphabetically, depending on context.

## Saved Views

Users can save their current filter/sort/column configuration as a named view.

### Creating a Saved View

1. User configures filters, sort, and column visibility.
2. "Save view" action (in the toolbar or filter bar).
3. Name input with optional description.
4. Visibility: "Only me" or "Team" (if supported).
5. Saved view appears in a dropdown/list for quick access.

### Managing Saved Views

- Views are listed in a dropdown or sidebar.
- Current view is indicated by name in the filter area.
- Users can update, rename, duplicate, or delete their views.
- Team views are read-only for non-creators but can be duplicated.
- When a saved view is active and the user changes a filter, a "modified" indicator appears with options to save changes or revert.

## Filter State Persistence

Filters can be persisted at three levels:

| Persistence | Mechanism | Use |
|-------------|-----------|-----|
| **URL** | Query parameters | Shareable links. Users can bookmark or share a filtered view. |
| **Session** | sessionStorage | Preserved across page navigation within a session but not across sessions. |
| **Persistent** | localStorage or server-side | Saved views that persist across sessions. |

**Default behavior:** URL persistence for simple filters (so URLs are shareable), localStorage for column visibility and sort preferences, and server-side for named saved views.

## Keyboard Interaction

- **Focus management**: Opening a filter control focuses the first option. Closing returns focus to the trigger.
- **Keyboard shortcuts**: `/` to focus the search input (a common convention in data apps).
- **Clear shortcuts**: `Escape` in a search input clears it. `Backspace` in an empty tag/multi-select input removes the last tag.
- **Type-ahead**: In select/dropdown filters, typing jumps to matching options.
