# Phase 7: Layout & Patterns

**Architecture Level:** Level 6 (Templates)
**Dependencies:** Phase 6 (Domain Components)
**Source of truth:** [design/architecture.md](../design/architecture.md) (Level 6 rules), [design/foundations/layout.md](../design/foundations/layout.md), [design/patterns/navigation-and-hierarchy.md](../design/patterns/navigation-and-hierarchy.md)

## Objective

Build the layout template components that define how pages and views are structured. These are slots-based — they define regions and let consumers fill them. They handle the hard layout problems: fixed + fluid hybrids, resizable panels, sticky elements, overflow management, and responsive reflow.

## Directory Structure

```
src/
  layouts/                   # New directory
    AppShell/
      AppShell.tsx
      AppShell.css
      AppShell.test.tsx
      index.ts
    DashboardLayout/
    DetailView/
    SplitView/
    ReportLayout/
    ResizablePanel/          # Utility component used by layouts
    Sidebar/
    Breadcrumbs/
    index.ts
```

## Components

### AppShell

The outermost application frame: top bar, sidebar, and content area.

**API:**
```tsx
<AppShell>
  <AppShell.Header>
    <Logo /><TopNav /><UserMenu />
  </AppShell.Header>
  <AppShell.Sidebar>
    <SidebarNav items={navItems} />
  </AppShell.Sidebar>
  <AppShell.Main>
    {children}
  </AppShell.Main>
</AppShell>
```

**Props (AppShell):**
| Prop | Type | Default |
|------|------|---------|
| `sidebarCollapsed` | `boolean` | `false` |
| `onSidebarCollapse` | `(collapsed: boolean) => void` | — |
| `sidebarWidth` | `number` (px) | `240` |
| `sidebarCollapsedWidth` | `number` (px) | `56` |

**Behavior per [design/foundations/layout.md](../design/foundations/layout.md):**
- Header: fixed height, sticky at top, full width, z-index `z.sticky.header`.
- Sidebar: fixed width, full height minus header, scrollable if content overflows. Collapsible to icon rail.
- Main: fluid, fills remaining space, scrollable.
- Responsive: sidebar collapses to icon rail at tablet, hidden at mobile (hamburger menu).

**Tests:**
- Renders header, sidebar, and main areas.
- Sidebar collapse toggles width between full and icon-rail.
- Main area fills remaining width.
- Header is sticky.
- Responsive behavior at breakpoints (use container mock or CSS class checks).
- axe-core passes (landmark roles: banner, navigation, main).

### Sidebar

Navigation sidebar with sections, links, and collapsible groups.

**API:**
```tsx
<Sidebar collapsed={false}>
  <Sidebar.Section title="Main">
    <Sidebar.Link icon={<IconHome />} href="/" active>Dashboard</Sidebar.Link>
    <Sidebar.Link icon={<IconChart />} href="/analytics">Analytics</Sidebar.Link>
  </Sidebar.Section>
  <Sidebar.Section title="Settings" collapsible>
    <Sidebar.Link icon={<IconSettings />} href="/settings">General</Sidebar.Link>
  </Sidebar.Section>
</Sidebar>
```

**Behavior:**
- Active link highlighted.
- Collapsed mode: only icons visible, full label in tooltip on hover.
- Collapsible sections expand/collapse with chevron indicator.
- Keyboard: arrow keys navigate links, Enter activates.
- Uses `<nav>` element with `aria-label`.

**Tests:**
- Active link renders with active styles.
- Collapsed mode shows only icons.
- Collapsed link shows tooltip with label.
- Collapsible section toggles.
- Keyboard navigation works.
- axe-core passes.

### DashboardLayout

A layout for dashboard views: optional filter bar at top, responsive grid of widget slots.

**API:**
```tsx
<DashboardLayout columns={3}>
  <DashboardLayout.FilterBar>
    <FilterBar ... />
  </DashboardLayout.FilterBar>
  <DashboardLayout.Widget span={2}>
    <MetricCard ... />
  </DashboardLayout.Widget>
  <DashboardLayout.Widget>
    <MetricCard ... />
  </DashboardLayout.Widget>
  <DashboardLayout.Widget span={3}>
    <DataTable ... />
  </DashboardLayout.Widget>
</DashboardLayout>
```

**Props (DashboardLayout):**
| Prop | Type | Default |
|------|------|---------|
| `columns` | `1 \| 2 \| 3 \| 4` | `3` |
| `gap` | spacing token key | `"4"` |

**Props (Widget):**
| Prop | Type | Default |
|------|------|---------|
| `span` | `1 \| 2 \| 3 \| 4` | `1` |
| `minHeight` | `string \| number` | — |

**Responsive per [design/foundations/layout.md](../design/foundations/layout.md):**
- ≥ 1440px: up to 4 columns
- 1024-1439px: up to 3 columns
- 768-1023px: 2 columns
- < 768px: 1 column (stacked)

**Tests:**
- Renders grid with correct number of columns.
- Widget span occupies correct number of grid columns.
- FilterBar slot renders above grid.
- Responsive reflow at breakpoints.
- axe-core passes.

### DetailView

A layout for entity detail pages: breadcrumbs, title, action bar, and tabbed content.

**API:**
```tsx
<DetailView>
  <DetailView.Breadcrumbs>
    <Breadcrumbs items={[{ label: "Users", href: "/users" }, { label: "John Doe" }]} />
  </DetailView.Breadcrumbs>
  <DetailView.Header>
    <DetailView.Title>John Doe</DetailView.Title>
    <DetailView.Actions>
      <Button>Edit</Button>
      <Button variant="destructive">Delete</Button>
    </DetailView.Actions>
  </DetailView.Header>
  <DetailView.Tabs>
    <Tabs ...>{tabContent}</Tabs>
  </DetailView.Tabs>
</DetailView>
```

**Tests:**
- Renders breadcrumbs, header, and tabs slots.
- All slots are optional.
- Title and actions layout correctly.
- axe-core passes.

### Breadcrumbs

Navigation breadcrumbs per [design/patterns/navigation-and-hierarchy.md](../design/patterns/navigation-and-hierarchy.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `items` | `Array<{ label: string; href?: string }>` | required |
| `maxItems` | `number` | `5` |
| `separator` | `ReactNode` | `"/"` |

**Behavior:**
- Last item is the current page (not a link).
- When items exceed `maxItems`, middle items collapse to "..." with a dropdown to expand.
- Uses `<nav aria-label="Breadcrumb">` and `<ol>`.

**Tests:**
- Renders all items as links except the last.
- Collapses middle items when exceeding maxItems.
- Separator renders between items.
- ARIA: nav with aria-label, current page with `aria-current="page"`.
- axe-core passes.

### SplitView

A resizable two-panel layout for master/detail patterns.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `defaultSize` | `number` (px or %) | `"50%"` |
| `minSize` | `number` (px) | `200` |
| `maxSize` | `number` (px) | — |
| `collapsible` | `boolean` | `false` |
| `collapsed` | `boolean` | `false` |
| `onCollapse` | `(collapsed: boolean) => void` | — |

**API:**
```tsx
<SplitView defaultSize={300} minSize={200} collapsible>
  <SplitView.Primary>
    <MasterList ... />
  </SplitView.Primary>
  <SplitView.Secondary>
    <DetailPanel ... />
  </SplitView.Secondary>
</SplitView>
```

**Behavior per [design/foundations/layout.md](../design/foundations/layout.md):**
- Drag handle between panels for resizing.
- Minimum and maximum size constraints.
- Collapse button minimizes the primary panel.
- Size persisted to localStorage.
- Keyboard: arrow keys on focused drag handle adjust size.
- Responsive: below tablet, panels stack vertically.

**Tests:**
- Renders two panels with a drag handle.
- Resizing changes panel widths within constraints.
- Collapse button hides the primary panel.
- Keyboard resizing works.
- Size constraints are enforced.
- axe-core passes.

### ReportLayout

A layout for report/list views: filter bar, results area, and optional export toolbar.

**API:**
```tsx
<ReportLayout>
  <ReportLayout.Toolbar>
    <SearchInput ... />
    <FilterBar ... />
    <Button>Export</Button>
  </ReportLayout.Toolbar>
  <ReportLayout.Content>
    <DataTable ... />
  </ReportLayout.Content>
  <ReportLayout.Footer>
    <Pagination ... />
  </ReportLayout.Footer>
</ReportLayout>
```

**Behavior:**
- Toolbar is sticky below the page header.
- Content fills remaining vertical space and scrolls internally.
- Footer is sticky at the bottom.

**Tests:**
- Renders toolbar, content, and footer slots.
- All slots are optional.
- Toolbar sticky positioning (CSS class check).
- axe-core passes.

### ResizablePanel (utility)

A lower-level utility component used by SplitView. Provides the drag handle and resize logic.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `onResize` | `(size: number) => void` | required |
| `minSize` | `number` | `0` |
| `maxSize` | `number` | `Infinity` |

**Tests:**
- Mouse drag resizes panel.
- Keyboard arrows resize in increments.
- Constraints enforced.
- `role="separator"` with `aria-valuenow`.
- axe-core passes.

## Development Order

1. ResizablePanel (utility needed by SplitView)
2. Breadcrumbs (simple, needed by DetailView)
3. Sidebar (needed by AppShell)
4. AppShell
5. SplitView
6. DashboardLayout
7. DetailView
8. ReportLayout
9. Barrel exports + dev playground updates

## Testing Strategy

Layout component tests emphasize:

1. **Slot rendering**: All slots render, all are optional, content fills correctly.
2. **Responsive behavior**: Breakpoint-based layout changes.
3. **Resize behavior**: Drag handle, constraints, persistence, keyboard support.
4. **Sticky positioning**: Correct CSS classes applied for sticky elements.
5. **Landmark roles**: `<header>`, `<nav>`, `<main>`, `<aside>` used correctly.
6. **Composition**: Layouts compose correctly with domain components.

## Completion Criteria

- [ ] All 8 layout components implemented.
- [ ] AppShell provides the application frame with collapsible sidebar.
- [ ] SplitView supports drag-to-resize with constraints and keyboard support.
- [ ] DashboardLayout provides a responsive grid with widget slots.
- [ ] DetailView provides breadcrumb + header + tabs structure.
- [ ] ReportLayout provides toolbar + content + footer with sticky zones.
- [ ] Breadcrumbs support collapsing and correct ARIA.
- [ ] All layouts use semantic HTML landmark roles.
- [ ] All layouts support density and theming.
- [ ] All components have comprehensive tests with axe-core.
- [ ] Components exported from `src/layouts/index.ts` and `src/index.ts`.
- [ ] Dev playground updated with Layouts section showing composed examples.
- [ ] `npm run typecheck && npm run lint && npm test` passes.
