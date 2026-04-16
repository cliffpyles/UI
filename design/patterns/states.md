# UI States

Data applications have far more states than typical web UIs. Every component that displays or interacts with data must handle the full spectrum of states. A component that only handles the happy path is incomplete.

## State Taxonomy

### Loading

Data is being fetched or computed. The user knows something is happening.

**Skeleton screens** (default): Placeholder shapes that mirror the layout of the expected content. Used for content regions (cards, tables, charts).

- Match the approximate layout of the loaded content.
- Use a pulse animation (`duration: 1.5s`, ease-in-out).
- Do not show skeleton content that is more detailed than the actual content — keep shapes simple.

**Spinners**: Used for actions, not content. A button's loading state, an inline save indicator, a refresh action.

**Progress bars**: Used when progress is determinate (file upload, data processing). Indeterminate variant for unknown duration.

**Rules:**
- Loading states appear after 200ms of delay. Instant responses (< 200ms) show no loading indicator at all — the flash is more jarring than the wait.
- Partial loading is preferred over all-or-nothing. If a dashboard has 6 panels, show each panel's skeleton independently and reveal each as its data arrives.
- Skeleton → content transitions use a simple fade (100ms) — no complex animations that delay showing the data.

### Empty

No data to display. This state has distinct sub-types, each with different visual treatment and guidance:

| Sub-type | Message pattern | Visual | Action |
|----------|----------------|--------|--------|
| **No data exists** | "No [items] yet" | Illustration + message | Primary CTA to create first item |
| **No results match** | "No results for [query]" | Search/filter illustration | Suggest clearing filters, show active filters |
| **Error caused empty** | "Couldn't load [items]" | Error illustration | Retry button |
| **First-use / onboarding** | "Get started with [feature]" | Welcome illustration | Step-by-step guidance |
| **Permission restricted** | "You don't have access to [items]" | Lock illustration | Request access link or contact info |

**Rules:**
- Empty states always explain why there's no data and what the user can do about it.
- Empty states in tables show a single merged row spanning all columns — not an empty table with headers and no rows.
- Empty states in charts show the chart frame (axes, labels) with a centered message — not a blank space.
- Nested empty states are avoided. If a card within a dashboard has no data, the card shows its empty state — but the dashboard itself does not show a full-page empty state because of one empty card.

### Error

Something went wrong. The user needs to know what happened, whether it's their fault, and what they can do.

See [Error Handling](./error-handling.md) for the full error taxonomy and patterns.

Summary of error display levels:

| Scope | Pattern |
|-------|---------|
| **Field-level** | Inline error message below the field, red border |
| **Component-level** | Error state within the component's bounds (table row, chart panel) |
| **Section-level** | Error banner within a page section, other sections still functional |
| **Page-level** | Full-page error with recovery actions |
| **Global** | Toast notification for transient errors, banner for persistent ones |

### Partial Data

Some data loaded successfully, but not all. This is distinct from loading (we're not waiting) and from error (it's not broken — it's incomplete).

**Patterns:**
- Columns that haven't loaded show a subtle skeleton or "—" placeholder.
- Dashboard panels that failed independently show their individual error state while successful panels display normally.
- Data that is present but may not include all records shows a "partial results" indicator with an explanation.

### Stale Data

Data exists but may be outdated. The user needs to know they're looking at a snapshot, not live data.

**Patterns:**
- **Timestamp indicator**: "Last updated 5 minutes ago" in the component header or footer.
- **Stale warning**: When data exceeds a staleness threshold, a yellow/amber indicator appears: "Data may be outdated. Refresh to update."
- **Connection lost**: When the data source connection is interrupted, a persistent banner indicates the disconnection and shows the age of the displayed data.
- **Auto-refresh indicator**: If data refreshes on a timer, show the countdown or a "refreshing..." state.

**Rules:**
- Stale data is always better than no data. Never clear the display because data is stale — always show the stale data with a staleness indicator.
- Staleness thresholds are configurable per data source. A metric that updates every minute is stale after 5 minutes. A daily report is stale after 25 hours.

### Disabled

The element exists but cannot be interacted with. This is a property of the component, not the data.

- Reduced opacity (50%).
- Cursor changes to `not-allowed`.
- Tooltip explains _why_ the element is disabled: "Requires admin permissions" or "Select at least one item."
- Interactive elements within a disabled container are all disabled.

### Read-Only

Data is visible and selectable (for copy/paste) but not editable. Distinct from disabled — read-only content is fully legible and interactive for reading purposes.

- No reduced opacity.
- No edit controls (pencil icons, input borders).
- Text is selectable.
- Tooltip or label indicates read-only status and why: "Read-only — changes require editor permissions."

## State Transitions

When a component transitions between states:

| Transition | Behavior |
|------------|----------|
| Loading → Loaded | Fade transition (100ms). No layout shift. |
| Loading → Error | Replace skeleton with error state. Same container bounds. |
| Loaded → Loading (refresh) | Keep existing data visible, show subtle refresh indicator (not a full skeleton). |
| Loaded → Stale | Add staleness indicator without disrupting the display. |
| Loaded → Error (on refresh) | Keep the last known data, show an error toast. Do not replace good data with an error screen. |

**Critical rule:** Once data has been successfully loaded and displayed, it is never replaced with a loading or error state during a refresh attempt. The existing data remains visible with an overlay or notification indicating the refresh state.
