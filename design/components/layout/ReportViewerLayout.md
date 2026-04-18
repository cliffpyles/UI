---
name: ReportViewerLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Box, Pagination, Button, Menu]
replaces-raw: []
---

# ReportViewerLayout

> A read-only, paginated frame for consuming a generated report with header actions and an export menu.

## Purpose
Once a report is generated, every viewing surface has the same shape: a header with title and actions, a paginated body, and a footer with page controls. ReportViewerLayout owns that frame so callers only supply the report content and the action handlers — pagination wiring, the export/share menu slot, and the print-friendly main region are uniform across the product.

## When to use
- Viewing a saved or generated report
- Multi-page document-style content with print/export affordances
- Read-only consumption surfaces that need consistent page navigation and action menus

## When NOT to use
- Authoring or editing a report → use **ReportBuilderLayout**
- A live data table → use **DataTable**
- Sharing a link to the report → use **SharedLinkLayout**

## Composition (required)
| Concern              | Use                                                  | Never                                  |
|----------------------|------------------------------------------------------|----------------------------------------|
| Frame layout         | `Box direction="column">` (header / body / footer) | hand-rolled flex CSS                   |
| Header row           | `Box direction="row" align="center" justify="between" gap>` | hand-rolled flex CSS          |
| Action group         | `Box direction="row" gap>`                         | hand-rolled flex CSS                   |
| Action buttons       | `Button`                                           | raw `<button>`                       |
| Overflow / export menu | `Menu`                                           | bespoke dropdown                       |
| Body region          | `Box>` (scroll container)                          | raw `<div>` with overflow CSS        |
| Footer pagination    | `Pagination`                                       | bespoke prev/next buttons              |

## API contract
```ts
interface ReportViewerLayoutProps extends HTMLAttributes<HTMLDivElement> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  overflowMenu?: ReactNode;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  children: ReactNode;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Header, body, and pagination footer all rendered                      |
| single-page  | When `pageCount <= 1`, footer collapses                              |
| no-actions   | When `actions` and `overflowMenu` omitted, header action group hides |
| narrow viewport | Primary actions collapse into the overflow `Menu`                |

## Accessibility
- Root carries `role="region"` with `aria-label` matching the title
- Body region is the primary scroll container and uses `aria-live="polite"` only when page changes are announced
- `Pagination` provides `aria-label="Page navigation"` and per-page button labels
- Overflow `Menu` trigger exposes `aria-haspopup="menu"` and `aria-expanded`

## Tokens
- Inherits all tokens from `Box`, `Pagination`, `Button`, `Menu`
- Adds (component tier): `--report-viewer-header-height`, `--report-viewer-footer-height`

## Do / Don't
```tsx
// DO
<ReportViewerLayout
  title="Q1 revenue report"
  actions={<Button variant="primary">Export</Button>}
  overflowMenu={<ReportOverflowMenu/>}
  page={page}
  pageCount={total}
  onPageChange={setPage}
>
  <ReportPage data={data[page]}/>
</ReportViewerLayout>

// DON'T — bespoke prev/next pager
<button onClick={prev}>‹</button> Page 1 / 10 <button onClick={next}>›</button>

// DON'T — raw button for export
<button onClick={exportPdf}>Export</button>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ReportViewerLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline ▲, ▼, ↑, ↓ glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders title, body, and pagination footer in the default state
- `onPageChange` invoked when `Pagination` controls are activated
- Footer collapses when `pageCount <= 1`
- Composition probes: `Box` at root; `Pagination` in footer; `Button` in action slot; `Menu` in overflow slot
- Forwards ref; spreads remaining props onto root
- axe-core passes for default and single-page states
