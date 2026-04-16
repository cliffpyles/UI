# Phase 8: Advanced Cross-Cutting Features

**Architecture Level:** Cross-cutting (Levels 3-6)
**Dependencies:** Phase 7b (Layout & Pattern Components — Specialized)
**Source of truth:** [design/patterns/real-time-data.md](../design/patterns/real-time-data.md), [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md), [design/foundations/motion.md](../design/foundations/motion.md), [design/patterns/export-and-sharing.md](../design/patterns/export-and-sharing.md)

## Objective

Build cross-cutting systems that span multiple components and levels. These are not individual components — they are infrastructure that enhances the behavior of existing components: real-time data management, keyboard shortcut orchestration, guided onboarding, and value change animation.

Items that were in the original Phase 8 but are now covered by earlier phases:
- **Toast / Notification System** → Phase 6a (Domain: Notification & Messaging)
- **Connection Status Indicator** → Phase 6a (Domain: Status & State)
- **Export Menu** → Phase 6b (Domain: Data Table Toolbar)
- **CopyButton** → Phase 6c (Domain: utility component, or inline in components)

## Deliverables

### 1. Keyboard Shortcut System

A centralized keyboard shortcut registry per [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md).

**API:**
```tsx
<KeyboardShortcutProvider>
  {children}
</KeyboardShortcutProvider>

useKeyboardShortcut("mod+k", () => openSearch(), { description: "Search", category: "Navigation" });
useKeyboardShortcut("mod+e", () => exportData(), { description: "Export", category: "Actions" });

<KeyboardShortcutCheatSheet /> // Opens via "?" key
```

**Behavior:**
- `mod` maps to `⌘` on Mac, `Ctrl` on Windows/Linux.
- Shortcuts disabled when focus is in an input/textarea/contenteditable.
- "?" key opens a cheat sheet dialog listing all registered shortcuts by category.
- Shortcuts shown in Tooltip content of their associated actions.
- Conflict detection: warns in development if two shortcuts use the same key combo.
- Cleanup: shortcuts unregister when the component unmounts.

**Tests:**
- Registered shortcut fires handler on key press.
- `mod` resolves correctly per platform.
- Shortcuts disabled in input fields.
- Cheat sheet dialog lists all registered shortcuts by category.
- Conflicting shortcuts warn in development.
- Cleanup on unmount.
- axe-core passes on cheat sheet dialog.

### 2. Coachmark / Feature Tour System

A step-by-step guided tour overlay per [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md).

**API:**
```tsx
<Tour
  id="onboarding"
  steps={[
    { target: "#filter-bar", title: "Filter Bar", content: "Use filters to narrow your data." },
    { target: "#data-table", title: "Data Table", content: "Click a row to see details." },
    { target: "#export-btn", title: "Export", content: "Download your data in multiple formats." },
  ]}
  onComplete={() => markComplete("onboarding")}
  onSkip={() => markComplete("onboarding")}
/>
```

**Behavior:**
- Dimmed overlay with a highlight cutout around the target element.
- Tooltip-style popover pointing to the target.
- "Next", "Previous", "Skip tour" buttons.
- Progress indicator (step 2 of 5).
- Tour completion persisted per user per tour ID.
- Maximum 7 steps per tour.
- Respects `prefers-reduced-motion`.

**Tests:**
- Steps render in order with correct target highlighting.
- Next/Previous navigation.
- Skip fires onSkip.
- Completing all steps fires onComplete.
- Overlay dims non-target areas.
- Tooltip positioned correctly relative to target.
- axe-core passes.

### 3. Value Change Animation System

A hook and wrapper for highlighting when data values change per [design/patterns/real-time-data.md](../design/patterns/real-time-data.md).

**API:**
```tsx
// Hook
const { ref, isHighlighted } = useValueChange(value, { direction: true });

// Wrapper component
<ValueChangeIndicator value={currentValue} highlight direction>
  <MetricValue value={currentValue} />
</ValueChangeIndicator>
```

**Behavior:**
- When value changes, applies a brief background flash (1s fade from `color.action.primary.bg` to transparent).
- If `direction` is true and value is numeric, shows ▲/▼ based on change direction.
- Rate limiting: highlight disabled if values change more than once per second.
- Respects `prefers-reduced-motion`.

**Tests:**
- Highlight CSS class applied on value change, removed after transition.
- Direction indicator shows correct arrow for increase/decrease.
- Rate limiting disables highlight at high frequency.
- Reduced motion: no animation, instant state change only.

### 4. Real-Time Data Hooks

A set of hooks for managing real-time data concerns across the application.

**API:**
```tsx
// Connection management
const { status, reconnect } = useConnectionStatus(dataSource);

// Staleness tracking
const { isFresh, isStale, isCritical, age } = useStaleness(lastUpdated, {
  staleThreshold: 5 * 60 * 1000,    // 5 minutes
  criticalThreshold: 30 * 60 * 1000, // 30 minutes
});

// Optimistic updates
const { value, update, rollback, isPending } = useOptimisticUpdate(serverValue, updateFn);

// Live data polling
const { data, loading, error, refresh } = usePolling(fetchFn, {
  interval: 30000,
  enabled: true,
  onError: handleError,
});
```

**Tests:**
- Connection status transitions (connected → disconnected → reconnecting → recovered).
- Staleness thresholds computed correctly from timestamps.
- Optimistic update reflects immediately, rolls back on failure.
- Polling starts/stops based on `enabled`, respects interval, handles errors.
- Cleanup: all intervals/subscriptions cleared on unmount.

### 5. Drag and Drop Infrastructure

A lightweight drag-and-drop system for Kanban boards, column reordering, dashboard widget arrangement, and file uploads.

**API:**
```tsx
<DragDropProvider onDragEnd={handleReorder}>
  <Droppable id="column-1">
    <Draggable id="card-1"><TaskCard ... /></Draggable>
    <Draggable id="card-2"><TaskCard ... /></Draggable>
  </Droppable>
  <Droppable id="column-2">
    <Draggable id="card-3"><TaskCard ... /></Draggable>
  </Droppable>
</DragDropProvider>
```

**Behavior:**
- Mouse and touch drag support.
- Visual drag preview (follows cursor).
- Drop zone highlighting (valid/invalid).
- Keyboard: Space to pick up, arrow keys to move, Space to drop, Escape to cancel.
- ARIA: `aria-grabbed`, `aria-dropeffect`, live region announcements.

**Tests:**
- Mouse drag and drop between zones.
- Keyboard drag and drop.
- Invalid drop zone rejection.
- ARIA attributes update during drag.
- Cleanup on unmount.
- axe-core passes.

## Development Order

1. Keyboard Shortcut System (standalone, no component dependencies)
2. Value Change Animation System (standalone hook + wrapper)
3. Real-Time Data Hooks (standalone hooks)
4. Coachmark / Feature Tour System (needs overlay + positioning logic)
5. Drag and Drop Infrastructure (complex interaction)

## Testing Strategy

Cross-cutting feature tests emphasize:

1. **Timing behavior**: Animation durations, rate limiting, polling intervals, debouncing.
2. **Global state**: Shortcut registry, tour progress persistence.
3. **Platform differences**: `mod` key mapping (meta vs ctrl).
4. **Reduced motion**: All animations respect the preference.
5. **Cleanup**: All providers/hooks clean up listeners, timers, and subscriptions on unmount.
6. **Integration**: Features work within the theme and density system.
7. **Keyboard**: Full keyboard support for every interactive feature.

## Completion Criteria

- [ ] Keyboard shortcut system with registration, conflict detection, cheat sheet, and platform-aware `mod` key.
- [ ] Coachmark tour with step navigation, persistence, overlay highlighting, and skip.
- [ ] Value change animation with direction indicators and rate limiting.
- [ ] Real-time data hooks: connection status, staleness, optimistic updates, polling.
- [ ] Drag and drop with mouse, touch, and keyboard support.
- [ ] All features handle reduced motion correctly.
- [ ] All features clean up on unmount.
- [ ] All features have comprehensive tests with axe-core where applicable.
- [ ] Everything exported from barrel files.
- [ ] Dev playground updated with Advanced Features section.
- [ ] `npm run typecheck && npm run lint && npm test` passes.
