# Export & Sharing

Data application users frequently need to get data out of the application — to share with stakeholders, include in reports, or analyze in other tools. The export and sharing system covers file export, shareable links, and print.

## File Export

### Supported Formats

| Format | Use | Fidelity |
|--------|-----|----------|
| **CSV** | Raw data for spreadsheet or database import | Data only, no formatting |
| **Excel (.xlsx)** | Formatted data with headers, column types, and multiple sheets | Includes formatting, formulas if applicable |
| **PDF** | Visual reports for printing and sharing | Exact visual representation |
| **PNG/SVG** | Chart and dashboard screenshots | Visual only |
| **JSON** | Programmatic data access | Structured data with metadata |

### Export Scope

The user controls what is exported:

| Scope | Behavior |
|-------|----------|
| **Current view** | Exports only visible data (respects filters, sort, pagination) |
| **All data** | Exports the full dataset, ignoring pagination but respecting filters |
| **Selected rows** | Exports only rows the user has selected |

The export dialog makes the scope explicit: "Exporting 234 of 1,456 rows (filtered)" or "Exporting 15 selected rows."

### Export UX

1. User clicks "Export" action (in toolbar or context menu).
2. Export dialog shows: format selector, scope selector, optional column picker.
3. User confirms. Export begins.
4. **Small exports (< 5 seconds):** Direct download, no progress indicator.
5. **Large exports (> 5 seconds):** Progress indicator with cancel option. When complete, download link or notification.
6. Success toast: "Export complete. [Download file]"

### Column Selection

For CSV and Excel exports, the user can choose which columns to include:
- All visible columns selected by default.
- Hidden columns available to add.
- Drag to reorder export columns.
- "Select all / Deselect all" toggle.

## Shareable Links

Users share the current view state with others via URL.

### What the URL Encodes

| State | URL encoding |
|-------|-------------|
| **Active filters** | Query parameters: `?status=active&type=premium` |
| **Sort** | Query parameter: `?sort=revenue&dir=desc` |
| **Date range** | Query parameters: `?from=2025-01-01&to=2025-03-31` |
| **Pagination** | Query parameter: `?page=3&pageSize=50` |
| **Selected tab** | Path or query: `/dashboard/revenue` or `?tab=revenue` |
| **Drill-down path** | Path: `/dashboard/revenue/north-america` |

### Sharing UX

- "Copy link" action copies the current URL to the clipboard.
- Toast confirms: "Link copied to clipboard."
- The link is a complete representation of the current view — the recipient sees exactly what the sharer saw (subject to their permissions).

### Link Stability

- URLs use stable identifiers (IDs, slugs), not volatile references (row indices, temporary filter IDs).
- If a URL references a filter value that no longer exists, the filter is silently ignored and the view loads without it, with a subtle notification: "Some filters from this link are no longer available."

## Print

Data applications that produce reports need print support.

### Print Stylesheets

- Page header and footer with report title, date, and page numbers.
- Navigation (sidebar, top bar) is hidden.
- Background colors are adjusted for print (white backgrounds, high-contrast text).
- Charts are rendered as static images at print resolution.
- Tables that exceed one page break at row boundaries with repeated headers on each page.
- "Print view" button switches to a print-optimized layout before triggering `window.print()`.

### Dashboard Printing

- Each widget is rendered at a fixed, predictable size.
- Multi-column dashboards reflow to single-column for A4/Letter paper.
- A "Print dashboard" action generates a full-page print view of all widgets.

## Scheduled Reports

For applications that support it, users can schedule automatic data exports:

- **Schedule configuration**: Frequency (daily, weekly, monthly), day of week/month, time.
- **Format**: Same format options as manual export.
- **Delivery**: Email with attachment, or notification with download link.
- **Scope**: Saved filter/view configuration is used at execution time.
- **Management UI**: List of scheduled exports with next run time, edit, pause/resume, delete.
