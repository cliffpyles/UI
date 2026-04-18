---
name: Pagination
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: [navigation-and-hierarchy]
uses: [Box, Button, Icon, Text, Select]
replaces-raw: ["<nav>", "<button> for page controls"]
---

# Pagination

> Controls for moving through a paged list and (optionally) changing the page size.

## Purpose
Pagination owns the standard "first / prev / page indicator / next / last" affordance plus an optional rows-per-page selector and "Showing X–Y of Z" summary. It centralizes the disabled-edge logic, the localized en-dash separator, and the keyboard-accessible button group so every paged surface in the product behaves identically. The component is presentational — callers pass `page`, `totalPages`, and a callback; Pagination does not fetch.

## When to use
- Below or beside a `Table`, `DataTable`, or list view that exposes pages of results
- Anywhere users need explicit, keyboard-accessible page navigation

## When NOT to use
- Infinite scrolling or "Load more" affordances — neither is Pagination
- Single-page result sets — hide the component entirely
- Step navigation (wizard) — use a stepper, not Pagination
- Server-paged time series in a chart — that's a domain concern

## Composition (required)
| Concern              | Use                                          | Never                                       |
|----------------------|----------------------------------------------|---------------------------------------------|
| Root layout          | `Box display="flex" justify="between" align="center" gap>` inside a `<nav>` | hand-rolled flex CSS |
| Showing label        | `Text size="sm" color="secondary">`          | raw `<span>` with typography CSS            |
| Page indicator text  | `Text size="sm">`                            | raw `<span>` with typography CSS            |
| Rows-per-page label  | `Text as="label" size="sm">`                 | raw `<label>` with typography CSS           |
| Rows-per-page select | `Select size="sm">`                          | raw `<select>`                              |
| Prev/Next/First/Last buttons | `Button variant="ghost" size="sm">` icon-only | raw `<button>` with inline `<svg>`  |
| Chevron icons        | `Icon name="chevron-left|right|chevrons-left|chevrons-right">` | inline `<svg>`            |

## API contract
```ts
interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  page: number;                          // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;

  pageSize?: number;
  pageSizeOptions?: number[];            // default [10, 25, 50, 100]
  onPageSizeChange?: (size: number) => void;

  totalItems?: number;                   // enables "Showing X–Y of Z"
}
```

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Renders prev/next buttons + "Page X of Y"                             |
| at first page  | First and Previous buttons are `disabled`                             |
| at last page   | Next and Last buttons are `disabled`                                  |
| with totals    | When `totalItems` and `pageSize` provided → renders "Showing X–Y of Z" using en-dash (U+2013) |
| with sizer     | When `onPageSizeChange` provided → renders rows-per-page `Select`     |
| single page    | `totalPages <= 1` → component still renders but all controls disabled (caller may choose to hide) |

## Accessibility
- Root element is `<nav aria-label="Pagination">`.
- Each control button has an explicit `aria-label` ("First page", "Previous page", "Next page", "Last page") since they are icon-only.
- Disabled buttons use the native `disabled` attribute (not `aria-disabled` + click no-op).
- Page indicator is plain text — not announced as a live region (avoids chatter on every change).
- Rows-per-page select is wired via `Select`'s built-in label association.

## Tokens
- Button styling inherited from `Button` ghost size="sm"
- Indicator typography inherited from `Text size="sm"`
- Layout gap: `--pagination-gap`
- No component-specific colors

## Do / Don't
```tsx
// DO
<Pagination
  page={page}
  totalPages={totalPages}
  totalItems={totalItems}
  pageSize={pageSize}
  pageSizeOptions={[10, 25, 50]}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>

// DON'T — inline svg controls
<button onClick={prev}><svg>…</svg></button>

// DON'T — raw select for page size
<select value={pageSize} onChange={…}>…</select>

// DON'T — page indicator as a live region
<span aria-live="polite">Page {page}</span>
```

## Forbidden patterns (enforced)
- Raw `<button>` for any control (use `Button`)
- Inline `<svg>` (use `Icon`)
- Raw `<select>` / `<label>` for page size (use `Select`)
- Raw styled `<span>` for typography (use `Text`)
- Hand-rolled flex CSS (use `Box`)
- Hardcoded color, spacing, font-size values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- First/Previous disabled at page 1; Next/Last disabled at last page
- `onPageChange` fires with correct page number for each control
- "Showing X–Y of Z" renders only when `totalItems` and `pageSize` are both provided
- Page-size select is rendered only when `onPageSizeChange` is provided; calls back with a number
- En-dash (U+2013) is used in the showing label, not hyphen-minus
- Composition probe: `Button` renders controls; `Icon` renders chevrons; `Select` renders the sizer
- axe-core passes
