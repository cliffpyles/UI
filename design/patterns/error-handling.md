# Error Handling

Errors in data applications are complex and varied. A systematic approach classifies errors by type, contains their blast radius, and gives users clear recovery paths.

## Error Taxonomy

| Type | Cause | User message pattern | Recovery |
|------|-------|---------------------|----------|
| **Network** | Connection failed, timeout | "Unable to connect. Check your network connection." | Retry button, auto-retry with backoff |
| **Authentication** | Session expired, token invalid | "Your session has expired. Please sign in again." | Redirect to login |
| **Authorization** | Insufficient permissions | "You don't have permission to [action]." | Contact admin link, request access |
| **Not Found** | Resource deleted or invalid ID | "[Item] not found." | Navigate to parent, search |
| **Validation** | Invalid input data | "[Field] must be [constraint]." | Inline correction |
| **Conflict** | Concurrent modification | "This [item] was modified by someone else." | Show diff, merge options |
| **Rate Limit** | Too many requests | "Too many requests. Please wait [duration]." | Auto-retry with countdown |
| **Server** | Internal server error, 500 | "Something went wrong on our end." | Retry button, support link |
| **Data Format** | Unexpected data shape | "Unable to display this data." | Retry, report issue |
| **Computation** | Timeout, overflow | "This calculation took too long." | Suggest smaller scope, retry |

## Error Display Levels

Errors are displayed at the narrowest scope possible. An error in one panel should not take down the whole page.

### Inline (Field-Level)

Validation errors on form inputs.
- Red border on the input.
- Error message directly below in `color.status.error`.
- Field remains editable for correction.

### Component-Level

Error within a single widget, table, or chart.
- Error replaces the component's content area.
- Component frame (header, border) remains visible.
- Shows: error icon, message, and recovery action (Retry).
- Other components on the page are unaffected.

### Section-Level

Error affecting a group of related components.
- Error banner at the top of the section.
- Section content below the banner may be partially functional.
- Dismissible if the error is transient.

### Page-Level

The entire page cannot function.
- Centered error display with icon, message, and actions.
- Actions: Retry, Go Home, Contact Support.
- Used only when the page's primary data source fails completely.

### Global

Errors that affect the entire application (auth expiry, total network loss).
- Persistent banner at the very top of the viewport, above all content.
- Not dismissible until resolved.
- Does not prevent interaction with cached/offline data if available.

## Error Boundaries

Each independently-loading content region is wrapped in an error boundary. This prevents a failure in one area from cascading to others.

**Granularity rules:**
- Each dashboard widget has its own error boundary.
- Each tab panel has its own error boundary.
- The page shell (header, sidebar) has a separate error boundary from the content area.
- Nested error boundaries cascade outward: if an inner boundary fails, the outer boundary catches it.

**Error boundary display:** When a boundary catches an error, it renders a component-level error state within its region. The error message includes a "Report this issue" action that captures error details.

## Retry Patterns

### Manual Retry

A "Retry" button in the error display. Clicking it re-attempts the failed operation.
- Button shows loading state during retry.
- If retry fails, the error message updates: "Still unable to load. [Retry] [Contact Support]"

### Automatic Retry

For transient errors (network, rate limit), the system retries automatically.
- Exponential backoff: 1s, 2s, 4s, 8s, max 30s.
- Maximum 3-5 automatic retries.
- Display during auto-retry: "Retrying... (attempt 2 of 3)" with a countdown to next attempt.
- After max retries, fall back to manual retry.

### Retry with Stale Data

When a refresh fails but stale data exists:
- Keep the stale data displayed.
- Show a non-blocking error: toast or subtle banner.
- "Unable to refresh. Showing data from [timestamp]. [Retry]"
- **Never replace good stale data with an error screen.**

## Partial Failure

When some parts of a view load and others fail:

- Each region shows its own state (loaded, error, loading) independently.
- A subtle page-level indicator: "Some data could not be loaded" with a count of failed regions.
- Successfully loaded regions are fully interactive — the user is not blocked.
- A "Retry all" action re-attempts all failed regions simultaneously.

## Error Messages

### Writing Rules

1. **Say what happened**, not technical details. "Unable to save" not "HTTP 500 Internal Server Error".
2. **Say what to do about it.** Every error message includes a recovery action or guidance.
3. **Be specific when possible.** "Unable to load revenue data" is better than "Something went wrong."
4. **Don't blame the user.** "We couldn't process that" not "You entered invalid data."
5. **No jargon.** Error codes can appear in a collapsed "Details" section for support purposes, but not in the primary message.

### Error Detail Expansion

For technical users and support scenarios, errors include a collapsed "Show details" section containing:
- Error code / HTTP status
- Request ID (for support correlation)
- Timestamp
- Technical message from the server (if available)
