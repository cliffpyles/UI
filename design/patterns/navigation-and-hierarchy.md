# Navigation & Data Hierarchy

Data applications routinely move between levels of aggregation — from summary to detail. This is a navigation challenge, a layout challenge, and a state management challenge simultaneously.

## Drill-Down Patterns

### Click-Through Drill-Down

The most common pattern. User clicks a row, card, or data point to navigate to a detail view.

```
Dashboard (summary) → Category view (filtered) → Detail view (single item)
```

**Rules:**
- The drill path is reflected in the URL. Each level is a distinct route.
- Breadcrumbs show the full drill path: "Dashboard > Revenue > Q1 2025 > North America"
- Back navigation (browser back, breadcrumb click) restores the previous level with its filter and sort state intact.
- The data hierarchy (Dashboard → Category → Detail) is not necessarily the same as the navigation hierarchy (URL path). Breadcrumbs follow the data hierarchy.

### Expand-In-Place

The detail is revealed within the current view, without navigating away. Used when context from the surrounding data is important.

```
┌──────┬───────────┬────────┐
│  ▶   │ Item A    │ $1,234 │
│  ▼   │ Item B    │ $5,678 │  ← Expanded
│      ├───────────┴────────┤
│      │ Detail content     │
│      │ for Item B...      │
│      ├───────────┬────────┤
│  ▶   │ Item C    │ $9,012 │
└──────┴───────────┴────────┘
```

- Chevron indicates expandable rows.
- Only one row expanded at a time (unless multi-expand is explicitly enabled).
- Expansion is animated (slide-down, `duration.normal`).
- Expanded content has access to the full row width.

### Side Panel Detail

Selecting an item opens a detail panel alongside the list. Both list and detail are visible simultaneously.

```
┌──────────────┬───────────────────────────────┐
│  Master List │  Detail Panel                 │
│              │                               │
│  Item A      │  Title: Item B                │
│  Item B ←──  │  Status: Active               │
│  Item C      │  Created: Mar 15, 2025        │
│              │  ...                          │
└──────────────┴───────────────────────────────┘
```

- Selected item is highlighted in the list.
- Panel width is resizable.
- Panel can be collapsed to return to list-only view.
- On narrow viewports, the panel replaces the list (with a back button).

## Breadcrumbs

Breadcrumbs reflect the user's drill path through data, not the URL hierarchy.

**Structure:**
```
Home > [Level 1 label] > [Level 2 label] > Current Level
```

- Each level is a link back to that aggregation level.
- Current level is not a link.
- If the path is too long, middle levels are collapsed: "Home > ... > Level 4 > Current"
- Breadcrumbs encode the filter/sort state of each level. Clicking a breadcrumb restores that level's exact state.

## State Preservation

When users navigate between hierarchy levels, state must be preserved:

| State | Preservation rule |
|-------|-------------------|
| **Scroll position** | Restored when returning to a list after viewing a detail. |
| **Filter state** | Preserved in URL or session. Returning to a list shows the same filters. |
| **Sort state** | Preserved in URL or session. |
| **Selection** | Cleared when navigating away (selections are contextual to the current view). |
| **Expanded rows** | Cleared when navigating away (too complex to serialize). |
| **Pagination** | Preserved. Returning to a list shows the same page. |

## Tree Views

Hierarchical data (org charts, file systems, category trees) displayed as expandable trees.

**Structure:**
- Indentation indicates depth (16px per level).
- Expand/collapse chevrons on nodes with children.
- Leaf nodes have no chevron.
- Loading indicator when children are fetched lazily.

**Interaction:**
- Click chevron to expand/collapse.
- Click node content to select.
- Arrow keys for keyboard navigation: up/down between siblings, right to expand, left to collapse.
- Type-ahead to jump to a node by name.

**Virtualization:** Trees with 1000+ nodes must be virtualized. Only visible nodes (and a buffer) are rendered.

## Navigation Patterns

### Tab Navigation

For switching between peer-level views within the same context (different aspects of the same entity).

```
┌──────────┬──────────┬──────────┐
│ Overview │ Details  │ History  │  ← Tabs
├──────────┴──────────┴──────────┤
│ Tab content                    │
└────────────────────────────────┘
```

- Tabs represent different views of the same data, not different data.
- The active tab is reflected in the URL (e.g., `/item/123/history`).
- Tab content is loaded on demand, not preloaded.

### Sidebar Navigation

For application-level navigation between major sections.

- Fixed position, always visible on desktop.
- Collapsible to icon-only on smaller viewports.
- Active section is highlighted.
- Nested navigation (section → sub-section) is supported via expandable groups or a secondary sidebar.

### Contextual Navigation

Actions and navigation related to the currently viewed entity.

- Action bar at the top of a detail view: Edit, Delete, Share, Export.
- Contextual menus (right-click or "..." menu) for item-level actions.
- Keyboard shortcuts for frequent actions (displayed in tooltip).
