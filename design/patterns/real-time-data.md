# Real-Time Data

Many data applications connect to streaming or frequently refreshed data sources. This introduces a class of UI problems that most design systems ignore: how to show change without causing distraction, how to handle connection loss, and how to manage update rates that exceed human perception.

## Update Strategies

### By Update Frequency

| Frequency | Strategy |
|-----------|----------|
| **< 1/minute** | Full refresh with change highlight (background flash). |
| **1/minute – 1/second** | Smooth value transition. Old value fades, new value appears. Brief highlight on changed values. |
| **1–10/second** | Batched updates. UI refreshes at a fixed interval (e.g., 250ms), showing the latest value. No per-update animation. |
| **> 10/second** | Sampled display. Show the latest value on a fixed timer. Use a chart or sparkline to convey rate of change. |

### Change Highlighting

When a value updates, signal the change:

- **Subtle background flash**: The cell or value container's background briefly shifts to `color.action.primary.bg` (blue-50 or equivalent), then fades back over 1 second.
- **Value color flash**: The number briefly renders in `color.action.primary`, then returns to `color.text.primary`.
- **Directional indicator**: For values that go up or down, a brief ▲ or ▼ icon appears next to the value, colored green/red (with icon shape as the primary signal, not just color).

**Rules:**
- Highlighting is disabled for high-frequency updates (> 1/second). Continuous flashing is worse than no highlighting.
- Highlighting is optional and user-configurable. Power users watching many values may turn it off.
- Multiple simultaneous updates in the same view stagger their highlights by 50ms to avoid a distracting simultaneous flash.

## Connection States

### Connected

Normal operation. No indicator needed unless the connection type is unusual (WebSocket vs. polling).

Optional: A subtle "Live" indicator (green dot + "Live" label) in the page header or toolbar to confirm real-time connection is active.

### Connecting / Reconnecting

Brief interruption. The system is attempting to restore the connection.

- "Reconnecting..." label with a spinner in the header/toolbar.
- Existing data remains displayed without modification.
- Reconnection attempts happen automatically with exponential backoff.

### Disconnected

Connection lost. Data is stale.

- **Persistent banner**: Yellow/amber banner at the top of the affected area: "Connection lost. Showing data from [timestamp]. Reconnecting..."
- Data remains displayed but is marked as stale.
- A "Retry" button allows manual reconnection attempt.
- If the disconnection affects only part of the page (one data source of several), only that section shows the warning.

### Recovered

Connection restored after a disconnection.

- Banner updates to "Connection restored" (green/success), then auto-dismisses after 5 seconds.
- Data refreshes to current values. Change highlighting is suppressed during the initial refresh to avoid a wall of flashing values.
- If the data changed significantly during the disconnection, a "Data updated" notification summarizes the changes.

## Optimistic UI

Showing a change before the server confirms it, and rolling back gracefully on failure.

### When to Use

- Toggle states (active/inactive)
- Simple value edits
- Adding/removing items from a list

### When Not to Use

- Financial transactions
- Irreversible destructive actions
- Multi-step operations

### Pattern

1. User takes action.
2. UI immediately reflects the change with a subtle saving indicator (spinner, "Saving...").
3. **Success**: Saving indicator shows brief success state ("Saved"), then disappears.
4. **Failure**: Change is rolled back. The original value is restored. An error toast explains what happened. The action is available to retry.

### Visual Treatment

- Optimistic changes are displayed normally (not visually distinguished from confirmed changes).
- The saving indicator is subtle — a small spinner or text label, not a blocking overlay.
- Rollback uses a brief transition (200ms) to smooth the value reversal.

## Staleness Indicators

Data has varying freshness requirements. A metric that updates every minute is stale after 5 minutes. A daily report is stale after 25 hours.

### Implementation

Each data source defines:
- `updateInterval`: How often data is expected to refresh.
- `staleThreshold`: After how long without an update the data is considered stale.
- `criticalThreshold`: After how long the data should be treated as unreliable.

### Display

| Freshness | Visual |
|-----------|--------|
| **Fresh** | No indicator. "Last updated: just now" in tooltip or footer. |
| **Aging** | Timestamp label: "Updated 3 minutes ago." No alarm. |
| **Stale** | Amber indicator: "Data may be outdated (last updated 15 minutes ago)." Refresh action. |
| **Critical** | Red indicator: "Data is significantly outdated (last updated 2 hours ago)." Prominent refresh action. |

## Screen Reader Announcements

Live data updates must be announced to screen readers using ARIA live regions.

| Update type | Politeness | Example |
|-------------|-----------|---------|
| **Alert / critical threshold** | `assertive` | "Alert: Server CPU usage at 95%" |
| **Connection state change** | `assertive` | "Connection lost. Showing stale data." |
| **Value update (tracked)** | `polite` | "Revenue updated to $1.2M" |
| **Routine update** | None | No announcement — let the user query when ready |

**Rule:** Never announce every value update via ARIA live regions. Continuous announcements make the screen reader unusable. Only announce values the user has explicitly chosen to monitor, and rate-limit announcements to at most one per 10 seconds per value.
