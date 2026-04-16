# Layout System

Standard 12-column grids were designed for marketing sites. Data applications need fixed + fluid hybrid layouts, resizable panels, and systematic overflow management. This layout system addresses those needs.

## Layout Primitives

### Fixed + Fluid Hybrid

The fundamental data-app layout: fixed-width sidebars and toolbars, with fluid content areas that fill remaining space.

```
┌──────────────────────────────────────────────────┐
│  Top Bar (fixed height)                          │
├────────┬─────────────────────────────────────────┤
│        │  Content Area (fluid)                   │
│  Side  │                                         │
│  Nav   │                                         │
│(fixed) │                                         │
│        │                                         │
└────────┴─────────────────────────────────────────┘
```

Implemented with CSS Grid or Flexbox. The fixed regions use explicit sizing; the fluid region uses `1fr` or `flex: 1`.

### Resizable Panels

Users control how much space each section gets. Panels have:
- A drag handle between them
- Minimum and maximum width/height constraints
- Persistence of user-chosen sizes (in localStorage)
- Keyboard control (arrow keys to resize when handle is focused)

### Split Views

Master/detail patterns where a list and its detail panel share horizontal space:

```
┌──────────────┬───────────────────────────────┐
│  Master List │  Detail Panel                 │
│  (resizable) │  (fills remaining space)      │
│              │                               │
│  Item 1      │  Title: Item 2                │
│  Item 2 ←──  │  Status: Active               │
│  Item 3      │  ...                          │
└──────────────┴───────────────────────────────┘
```

The divider between panels is draggable. Minimum panel widths prevent either panel from collapsing to an unusable size. A collapse button can minimize the master list to an icon rail.

## Overflow Management

When content exceeds its container:

| Strategy | When | Implementation |
|----------|------|----------------|
| **Horizontal scroll** | Wide tables, timelines | `overflow-x: auto` with scroll indicators (fade edges or scroll shadows) |
| **Vertical scroll** | Long lists, log output | `overflow-y: auto` with virtualization for large datasets |
| **Truncate** | Text in fixed-width columns | `text-overflow: ellipsis` + tooltip |
| **Collapse** | Secondary content in small viewports | Collapse to accordion, drawer, or "show more" |
| **Responsive reflow** | Dashboard panels on smaller screens | Grid reflows from multi-column to single-column |

**Rules:**
- Scroll containers must be visually indicated. Users should know they can scroll before they try.
- Nested scroll containers are avoided. If a scrollable panel is inside a scrollable page, the interaction is confusing. Prefer one scroll context per view.
- Horizontal scrolling of body content is never acceptable. Horizontal scroll is allowed only within explicit containers (tables, timelines, code blocks).

## Responsive Behavior

Data-app layouts have four meaningful breakpoints:

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| **Large monitor** | ≥ 1440px | Full layout: sidebar + multi-column content |
| **Laptop** | 1024–1439px | Default layout: sidebar may collapse, content is single or dual column |
| **Tablet** | 768–1023px | Sidebar collapsed to icon rail or hidden, content is single column |
| **Mobile** | < 768px | Stacked layout, navigation in bottom bar or hamburger menu |

**Data-specific responsive rules:**
- Tables reflow to card layouts below tablet breakpoint, or remain scrollable with frozen first column.
- Dashboards reflow from grid to vertical stack, preserving widget order by priority.
- Charts maintain aspect ratio but may simplify (remove legend, reduce axis labels) at smaller widths.
- Split views collapse to a stacked or navigable pattern (list → detail → back).

## Sticky Elements

Data apps make heavy use of sticky positioning:

| Element | Behavior |
|---------|----------|
| **Page header** | Sticky at top of viewport. Contains navigation, global actions. |
| **Table header** | Sticky at top of table scroll container. Always visible when scrolling rows. |
| **Table first column** | Sticky at left when table scrolls horizontally. |
| **Filter bar** | Sticky below page header. Active filters always visible while scrolling results. |
| **Action toolbar** | Sticky at bottom when items are selected (bulk actions). |

**Z-index strategy for stickies:**

```
z.sticky.header:      100
z.sticky.filter:       90
z.sticky.tableHeader:  80
z.sticky.column:       70
z.dropdown:           200
z.modal:              300
z.toast:              400
```

## Container Queries

Use container queries for components that need to adapt to their container's width, not the viewport.

Primary use cases:
- Dashboard widgets that may be in a 2-column or 4-column grid
- Detail panels that may be narrow (side panel) or wide (full page)
- Charts that need to adapt label density to their actual rendered width

```css
.ui-metric-card {
  container-type: inline-size;
}

@container (max-width: 200px) {
  .ui-metric-card__sparkline {
    display: none;
  }
}
```

## Viewport-Aware Layouts

Data apps are displayed on screens ranging from 13" laptops to wall-mounted displays in operations centers. The layout system accounts for this:

- **Default:** Optimized for 1920x1080 (the most common data-work screen size).
- **Compact mode:** Optimized for 1366x768 (common laptop resolution).
- **Display mode:** Optimized for 2560x1440+ (large monitors, TV displays). Increases content density and may show additional panels.

Layout mode can be set explicitly or derived from the viewport.
