# Permissions & Access

Enterprise data applications have complex permission models. The UI must reflect these permissions clearly, distinguishing between different types of access restriction without confusing users.

## Access States

These are distinct states with different visual treatments. They are not interchangeable.

### Enabled (Full Access)

Normal interactive state. No special indicators.

### Disabled

The control exists but cannot currently be activated. Typically due to a prerequisite not being met.

- **Visual**: 50% opacity, `cursor: not-allowed`.
- **Tooltip required**: Explains why: "Select at least one item" or "Available after step 2 is complete."
- **Not clickable**: Click events are suppressed.
- **Use when**: The restriction is temporary and contextual — the user can enable it by taking another action.

### Read-Only

Data is visible and selectable but not editable. The user has read access but not write access.

- **Visual**: No input borders or edit controls. Text appears as static content. Full opacity — the data is fully legible.
- **Selectable**: Text can be selected and copied.
- **Indicator**: Subtle label: "Read-only" or lock icon near the section header.
- **Use when**: The restriction is permission-based. The user can see the data but isn't authorized to modify it.

### Restricted

The user knows something exists but cannot access its content.

- **Visual**: Placeholder text: "You don't have permission to view this data." No data is shown — not even metadata.
- **Action**: "Request access" link or contact information for the data owner.
- **Use when**: The data exists but the user's role doesn't include access to it.

### Redacted

Specific fields are hidden while the rest of the record is visible. Used for column-level or field-level permissions.

- **Visual**: Redacted cells show "•••" or "Restricted" in `color.text.tertiary`. The cell is not empty — it's visually distinct from an empty value.
- **Tooltip**: "This field requires [role] access."
- **Sorting/filtering**: Redacted columns are excluded from sort and filter controls for that user.
- **Use when**: Row-level access is granted but some columns contain data above the user's clearance (PII, financial details, etc.).

### Hidden

The user doesn't know the feature or data exists. Used when even the existence of data is sensitive.

- **Visual**: The element is not rendered at all. No placeholder, no indication.
- **Navigation**: Menu items for hidden features are not shown.
- **URL access**: If a user navigates to a URL for a hidden resource, show a generic "Page not found" error — not "You don't have permission."
- **Use when**: The existence of the data or feature is itself sensitive information.

## Permission Patterns

### Row-Level Permissions

Different users see different rows in the same table.

- The table renders normally with only the rows the user has access to.
- Row count reflects the user's visible rows, not the total dataset.
- No indication that other rows exist (to avoid information leakage about data the user can't see).

### Column-Level Permissions

Some columns are visible to some users and not others.

- Columns the user can't see are not rendered — they don't appear in the header or in column configuration UI.
- If a shared view includes columns the current user can't see, those columns are silently omitted.
- Column count in configuration UI reflects the user's available columns.

### Action-Level Permissions

Certain actions (edit, delete, export) require specific roles.

- Buttons for unauthorized actions are either hidden (if discovery isn't important) or disabled with a tooltip explaining the required role.
- Context menus omit unauthorized actions.
- If a user reaches an action page they're not authorized for (via URL), show a permission error, not a generic 404.

### Conditional Permissions

Permissions that depend on data state (e.g., can only edit records with status "Draft").

- Controls are enabled/disabled based on the current record's state.
- Tooltip explains the condition: "Can only edit records in Draft status."
- If a bulk action affects a mix of permitted and non-permitted items, show a count: "3 of 7 selected items can be edited. Proceed with the 3 eligible items?"

## Audit & Compliance

For regulated industries, the UI must support audit visibility:

### Change History

- "History" or "Audit log" tab on detail views showing who changed what, when.
- Each entry shows: timestamp, user, action, changed fields with before/after values.
- Filterable by user, date range, and field.
- Read-only — no editing or deleting of audit entries.

### Access Logging

- User's own activity is visible in account settings: "Your recent activity."
- Admin view of all user activity for compliance reporting.
- Export capability for audit reports.

## Permission Errors

When a permission check fails at runtime (e.g., the user's role changed after page load):

- Show a specific error: "Your permissions have changed. You no longer have access to [action/data]."
- Offer to refresh the page to reflect current permissions.
- Do not silently fail — the user should always understand why something stopped working.
