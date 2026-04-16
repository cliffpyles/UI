# Data Entry

Data applications don't just display data — they require complex input. Forms in data apps involve conditional logic, specialized inputs, bulk editing, and validation at multiple levels. These patterns go far beyond simple contact forms.

## Form Architecture

### Form Layout

Forms use a consistent layout structure:

| Context | Layout | Max width |
|---------|--------|-----------|
| **Full-page form** | Single column, labels above inputs | 640px |
| **Settings page** | Section groups with headings, single column | 640px |
| **Modal form** | Single column within modal | Modal width (480-640px) |
| **Inline editing** | Input replaces display value in-place | Column width |
| **Filter bar** | Horizontal row of compact inputs | Full width |

### Label Placement

Labels are placed **above** their inputs by default. This provides the best scanability, accommodates long label text, and works at all density levels.

Exceptions:
- **Checkbox and radio**: Label to the right of the control.
- **Toggle**: Label to the left, toggle to the right.
- **Compact filter forms**: Labels may be inside the input as floating labels, or omitted in favor of placeholder text with a visible label on focus.

## Validation

Validation operates at three levels:

### Field-Level Validation

Triggered on blur (not on every keystroke). Shows an error message directly below the field.

- **Red border** on the input.
- **Error message** below the input in `color.status.error`, `font.size.sm`.
- **Error icon** (optional) inside the input at the trailing edge.
- When the user returns to the field and corrects the error, the error clears on blur or on the next validation pass.

### Group-Level Validation

For fields that are validated together (date range: start must be before end, password + confirm password).

- Error message appears below the group, not below individual fields.
- Both fields in the group receive error styling.

### Form-Level Validation

Cross-field and server-side validation. Triggered on form submission.

- **Error summary** at the top of the form listing all errors, with anchor links to each field.
- Individual field errors also display inline.
- Form scrolls to the first error and focuses it.
- Error summary uses an `alert` role for screen reader announcement.

## Specialized Inputs

Data applications require inputs beyond the standard text/select/checkbox set:

| Input | Use | Key behaviors |
|-------|-----|---------------|
| **Date picker** | Single date selection | Calendar popup, keyboard entry, min/max constraints |
| **Date range picker** | Start–end date selection | Two calendars, preset ranges ("Last 7 days"), validation that start < end |
| **Numeric stepper** | Precise numeric input | Increment/decrement buttons, min/max/step constraints, unit label |
| **Multi-select** | Selecting multiple options | Searchable dropdown, tag display for selected items, select all / clear all |
| **Tag input** | Free-form multiple values | Type + Enter to add, backspace to remove, autocomplete suggestions |
| **Combobox** | Select with search/filter | Searchable dropdown, supports custom values or restrict to list |
| **Expression editor** | Formula/query input | Syntax highlighting, autocomplete, error markers |
| **File upload** | File selection | Drag-and-drop zone, file type restrictions, size limits, upload progress |

Each specialized input supports all standard states: default, hover, focus, disabled, read-only, error, loading.

## Conditional Logic

Forms with fields that appear or disappear based on other field values:

**Rules:**
- Conditional fields animate in with a slide-down + fade (duration.normal). This helps users understand that the form structure changed.
- When a controlling field changes, dependent fields are revealed or hidden. Hidden fields are removed from the DOM (not just visually hidden) so they don't interfere with tab order or form submission.
- If a hidden field had a value, it is cleared when hidden and not submitted. This prevents stale data from conditional branches the user abandoned.
- The controlling field's label or help text should hint that selecting certain options will reveal more fields: "Selecting 'Custom' will show additional configuration options."

## Save Patterns

### Explicit Save

The default pattern. The user fills out the form and clicks a Save button.

- Save button is disabled until the form has changes.
- A "dirty" indicator (dot on the save button, or "Unsaved changes" label) appears when the form has been modified.
- Navigation away from a dirty form triggers a confirmation dialog: "You have unsaved changes. Discard?"

### Auto-Save

Used for settings, preferences, and any context where explicit save is unnecessary friction.

- Changes are saved after a debounce period (1-2 seconds after the last edit).
- A subtle save indicator shows the save state: "Saving..." → "Saved" → (indicator fades after 3 seconds).
- Failed saves show an error and offer retry.
- Auto-save never applies to destructive actions (deleting, revoking permissions).

### Inline Editing

Used for quick edits to individual values without opening a full form.

- Click a value to enter edit mode (or click an explicit "Edit" action).
- The display value is replaced with an input pre-filled with the current value.
- Enter or click outside confirms. Escape cancels.
- Saving shows a brief inline spinner, then the updated value.
- Only one cell/field is editable at a time (unless bulk editing).

## Bulk Editing

Editing a property across multiple items simultaneously:

- User selects rows (checkbox selection in a table).
- A bulk action toolbar appears (sticky at top or bottom).
- Bulk edit opens a compact form that applies values to all selected items.
- The form shows the current value if all selected items have the same value, or "Mixed" if they differ.
- Confirmation dialog shows: "Update [field] for [N] items?"
- Progress indicator for the batch operation, with success/failure count on completion.

## Form Accessibility

- Every input has a visible, associated `<label>` (`htmlFor`/`id` linkage).
- Required fields are indicated with "(required)" text, not just an asterisk.
- Error messages are linked to their field via `aria-describedby`.
- Error summary uses `role="alert"` for screen reader announcement.
- Form groups use `<fieldset>` and `<legend>` for logical grouping.
- Tab order follows visual order. Conditionally shown fields are inserted into the correct tab position.
