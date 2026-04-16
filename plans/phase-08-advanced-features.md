# Phase 8: Advanced Features

**Architecture Level:** Cross-cutting (Levels 3-6)
**Dependencies:** Phase 7 (Layout & Patterns)
**Source of truth:** [design/patterns/real-time-data.md](../design/patterns/real-time-data.md), [design/patterns/export-and-sharing.md](../design/patterns/export-and-sharing.md), [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md), [design/patterns/permissions-and-access.md](../design/patterns/permissions-and-access.md), [design/foundations/motion.md](../design/foundations/motion.md)

## Objective

Build the advanced feature set that distinguishes a data-intensive design system from a generic component library: real-time data support, export/sharing patterns, contextual help, keyboard shortcut management, and toast notifications. These components integrate with the existing system but solve problems specific to live data applications.

## Deliverables

### 1. Toast / Notification System

Global notification system for transient messages (success, error, info).

**API:**
```tsx
// Provider (wraps app)
<ToastProvider position="bottom-right" maxVisible={5}>
  {children}
</ToastProvider>

// Hook usage
const { toast } = useToast();
toast({ title: "Saved", variant: "success", duration: 5000 });
toast({ title: "Connection lost", description: "Retrying...", variant: "error", persistent: true });
```

**Toast props:**
| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | required |
| `description` | `ReactNode` | — |
| `variant` | `"success" \| "error" \| "warning" \| "info"` | `"info"` |
| `duration` | `number` (ms) | `5000` |
| `persistent` | `boolean` | `false` |
| `action` | `{ label: string; onClick: () => void }` | — |
| `onDismiss` | `() => void` | — |

**Behavior:**
- Stacks vertically. New toasts appear at the bottom of the stack.
- Auto-dismiss after `duration` (unless `persistent`).
- Dismiss on X button click or swipe (touch).
- Pause auto-dismiss on hover.
- Uses `role="status"` for info/success, `role="alert"` for error/warning.
- Enter/exit animation per [design/foundations/motion.md](../design/foundations/motion.md).
- z-index: `z.toast`.

**Tests:**
- Toast appears and auto-dismisses after duration.
- Persistent toast stays until dismissed.
- Hover pauses auto-dismiss.
- Dismiss button works.
- Action button fires callback.
- Correct ARIA role per variant.
- Multiple toasts stack correctly.
- axe-core passes.

### 2. Connection Status Indicator

Displays the real-time connection state per [design/patterns/real-time-data.md](../design/patterns/real-time-data.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `status` | `"connected" \| "connecting" \| "disconnected" \| "recovered"` | required |
| `lastUpdated` | `Date \| null` | — |
| `onRetry` | `() => void` | — |

**Behavior:**
- Connected: green dot + "Live" (optional, subtle).
- Connecting: spinner + "Reconnecting...".
- Disconnected: amber/red banner with "Connection lost. Showing data from [timestamp]. [Retry]".
- Recovered: success banner "Connection restored" that auto-dismisses after 5s.

**Tests:**
- Renders correct indicator for each status.
- Retry button fires onRetry.
- Recovered auto-dismisses.
- lastUpdated formatted via formatDate utility.
- `aria-live="assertive"` for disconnected/recovered state changes.
- axe-core passes.

### 3. Value Change Indicator

A wrapper that highlights when a value changes per [design/patterns/real-time-data.md](../design/patterns/real-time-data.md).

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `number \| string` | required |
| `highlight` | `boolean` | `true` |
| `direction` | `boolean` | `false` |

**Behavior:**
- When `value` changes, applies a brief background flash (1s fade from `color.action.primary.bg` to transparent).
- If `direction` is true and value is a number, shows a ▲/▼ indicator based on the change direction.
- Highlight is disabled if values change more than once per second (per rate-of-change rule).
- Respects `prefers-reduced-motion`.

**Tests:**
- Highlight CSS class applied on value change, removed after transition.
- Direction indicator shows correct arrow.
- No highlight when disabled.
- Reduced motion: no animation.

### 4. Keyboard Shortcut System

A centralized keyboard shortcut registry per [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md).

**API:**
```tsx
// Provider
<KeyboardShortcutProvider>
  {children}
</KeyboardShortcutProvider>

// Register shortcuts
useKeyboardShortcut("mod+k", () => openSearch(), { description: "Search" });
useKeyboardShortcut("mod+e", () => exportData(), { description: "Export" });

// Render cheat sheet
<KeyboardShortcutCheatSheet />  // Opens via "?" key
```

**useKeyboardShortcut props:**
| Prop | Type | Default |
|------|------|---------|
| `keys` | `string` | required |
| `handler` | `() => void` | required |
| `options.description` | `string` | — |
| `options.category` | `string` | `"General"` |
| `options.when` | `() => boolean` | `() => true` |

**Behavior:**
- `mod` maps to `⌘` on Mac, `Ctrl` on Windows/Linux.
- Shortcuts disabled when focus is in an input/textarea/contenteditable.
- "?" key opens a cheat sheet dialog listing all registered shortcuts by category.
- Shortcuts shown in tooltips of their associated actions.
- Conflicts detected: warn in dev mode if two shortcuts use the same key combo.

**Tests:**
- Registered shortcut fires handler on key press.
- `mod` resolves correctly per platform.
- Shortcuts disabled in input fields.
- Cheat sheet lists all registered shortcuts.
- Conflicting shortcuts warn in development.
- axe-core passes on cheat sheet dialog.

### 5. Coachmark / Feature Tour

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
  onComplete={() => markTourComplete("onboarding")}
  onSkip={() => markTourComplete("onboarding")}
/>
```

**Step:**
| Prop | Type | Default |
|------|------|---------|
| `target` | `string` (CSS selector) | required |
| `title` | `string` | required |
| `content` | `ReactNode` | required |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | auto |

**Behavior:**
- Dimmed overlay with a highlight cutout around the target element.
- Tooltip-style popover pointing to the target.
- "Next", "Previous", "Skip tour" buttons.
- Progress indicator (step 2 of 5).
- Tour completion state persisted (per user, per tour ID).
- Maximum 7 steps per tour.

**Tests:**
- Steps render in order.
- Next/Previous navigation works.
- Skip fires onSkip.
- Completing all steps fires onComplete.
- Overlay dims non-target areas.
- Tooltip positioned correctly relative to target.
- axe-core passes.

### 6. Export Menu

A standardized export action menu per [design/patterns/export-and-sharing.md](../design/patterns/export-and-sharing.md).

**API:**
```tsx
<ExportMenu
  formats={["csv", "xlsx", "pdf", "json"]}
  onExport={(format, scope) => handleExport(format, scope)}
  scope={{ filtered: 234, total: 1456, selected: 15 }}
/>
```

**Behavior:**
- Dropdown menu triggered by an "Export" button.
- Format options listed with icons.
- Scope selection: "Current view (234 rows)", "All data (1,456 rows)", "Selected (15 rows)".
- Fires `onExport(format, scope)` on selection.

**Tests:**
- Menu opens on button click.
- All format options render.
- Scope options reflect counts.
- onExport fires with correct format and scope.
- axe-core passes.

### 7. CopyButton

A button that copies a value to the clipboard with feedback.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | required |
| `label` | `string` | `"Copy"` |
| `copiedLabel` | `string` | `"Copied"` |
| `timeout` | `number` (ms) | `2000` |
| `size` | `"sm" \| "md"` | `"sm"` |
| `variant` | `"button" \| "icon"` | `"icon"` |

**Behavior:**
- Copies `value` to clipboard on click.
- Shows "Copied" state briefly (icon changes to checkmark, label changes).
- Reverts to default state after `timeout`.

**Tests:**
- Copies to clipboard (mock `navigator.clipboard.writeText`).
- Shows copied state temporarily.
- Reverts to default state after timeout.
- Both button and icon variants render correctly.
- axe-core passes.

## Development Order

1. Toast / Notification System (needed by other components for feedback)
2. CopyButton (simple, immediately useful)
3. Connection Status Indicator
4. Value Change Indicator
5. Keyboard Shortcut System
6. Export Menu
7. Coachmark / Feature Tour
8. Barrel exports + dev playground updates

## Testing Strategy

Advanced feature tests emphasize:

1. **Timing behavior**: Auto-dismiss, debouncing, transition completion.
2. **Global state**: Toast stacking, shortcut registry, tour progress persistence.
3. **Animation/transition**: CSS class presence checked, not visual testing.
4. **Platform differences**: `mod` key mapping (test with both meta and ctrl).
5. **Reduced motion**: All animations respect the preference.
6. **Integration**: Components work within the theme and density system.
7. **Cleanup**: Providers clean up event listeners and timers on unmount.

## Completion Criteria

- [ ] Toast system with stacking, auto-dismiss, persistence, and action buttons.
- [ ] Connection status indicator for all 4 states.
- [ ] Value change indicator with highlight and direction.
- [ ] Keyboard shortcut system with registration, conflict detection, and cheat sheet.
- [ ] Coachmark tour with step navigation and persistence.
- [ ] Export menu with format and scope selection.
- [ ] CopyButton with clipboard integration and feedback.
- [ ] All components handle reduced motion correctly.
- [ ] All components support density and theming.
- [ ] All components have comprehensive tests with axe-core.
- [ ] Components exported from barrel files.
- [ ] Dev playground updated with Advanced Features section.
- [ ] `npm run typecheck && npm run lint && npm test` passes.
