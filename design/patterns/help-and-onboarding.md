# Help & Onboarding

Dense, complex UIs require more in-product guidance than simpler applications. The system provides layered help: from quick tooltips to guided walkthroughs, scaled to the user's experience level.

## Progressive Disclosure

The interface layers complexity so that new users aren't overwhelmed and power users aren't blocked.

### Layering Strategy

| Layer | Visibility | Audience |
|-------|-----------|----------|
| **Primary actions** | Always visible | All users |
| **Secondary actions** | In toolbars and menus | Regular users |
| **Advanced features** | In "More" menus, settings, keyboard shortcuts | Power users |
| **Configuration** | In settings pages and admin panels | Admins |

**Rules:**
- The default view shows enough to complete the most common task. Advanced options are one click away, not zero.
- "Show advanced options" toggles are persistent per user (stored in preferences, not reset on navigation).
- Features are never hidden behind knowledge barriers. If a user can access a feature, they can discover it through the UI — no secret keyboard shortcuts or undocumented URL parameters.

## Tooltips

### When to Show Tooltips

| Element | Tooltip? | Content |
|---------|----------|---------|
| Icon-only button | **Always** | Action label: "Filter", "Export", "Refresh" |
| Truncated text | **Always** | Full text value |
| Ambiguous label | **Yes** | Clarification or definition |
| Abbreviation or acronym | **Yes** | Full term: "DAU — Daily Active Users" |
| Standard labeled button | **No** | The label is sufficient |
| Self-evident UI element | **No** | Don't tooltip obvious things |

### Tooltip Behavior

- **Delay**: Appear after 500ms hover (prevents flickering when the cursor passes over elements).
- **Positioning**: Prefer above the element. If above is clipped, flip to below. Left/right as fallback.
- **Duration**: Remain visible while the cursor is over the element or the tooltip itself.
- **Touch**: On touch devices, tooltips appear on long-press and dismiss on tap elsewhere.
- **Keyboard**: Focusable elements show their tooltip on focus.
- **Max width**: 240px. If content is longer, it wraps. If significantly longer, consider a popover instead.

### Info Tooltips

For metrics, column headers, and domain-specific terms that need definition:

- Triggered by an "ℹ" icon next to the label.
- Content includes: definition, calculation method (for metrics), and a "Learn more" link to documentation.
- These are distinct from hover tooltips — they require an explicit click/hover on the info icon.

## Coachmarks & Walkthroughs

For introducing new features or guiding first-time users through complex workflows.

### Coachmarks

A single tooltip-like overlay pointing to a specific UI element, with a short message and dismiss action.

```
┌──────────────────────────────┐
│  This is the filter bar.     │
│  Use it to narrow your data  │
│  by status, type, or date.   │
│                              │
│           [Got it]  [Next →] │
└──────────────┬───────────────┘
               ▼
         [Filter Bar]
```

**Rules:**
- Maximum 5-7 steps in a sequence. Longer sequences are broken into separate tours.
- Each step highlights exactly one element.
- Non-highlighted areas are dimmed (overlay at 50% opacity).
- "Skip tour" is always available.
- Tour progress is persisted — if a user dismisses at step 3, they can resume from step 3 later (or never, if they chose "Skip").
- Tours are shown at most once per user. Explicit "Show me around" action in help menu for replay.

### Feature Introduction

When a new feature is released:

- **What's new** notification: Subtle badge on a "What's new" menu item. Not a modal.
- **Inline callout**: A dismissible banner near the new feature: "New: You can now [feature]. [Learn more] [Dismiss]"
- **Never modal**: New feature announcements never block the user with a modal dialog. The user came to do work, not to read release notes.

## Contextual Help

### Help Panel

A slide-out panel (typically right side) containing help content relevant to the current page or feature.

- Triggered by a "?" icon in the page header.
- Content is contextual — changes based on the current page/section.
- Contains: overview, step-by-step instructions, related links, and a "Contact support" action.
- Does not overlay critical content — it pushes or overlays non-essential space.

### Inline Documentation for Metrics

Data applications display many domain-specific values. Each metric, KPI, or calculated field needs a consistent way to explain what it means.

**Pattern:**
- Label + ℹ icon: "Revenue ℹ"
- Clicking ℹ shows a popover with:
  - **Definition**: "Total revenue from all sources, excluding refunds."
  - **Calculation**: "Sum of order_amount where status != 'refunded'"
  - **Last updated**: Timestamp of the most recent data.
  - **Learn more**: Link to documentation or methodology page.

### Empty State Guidance

When a view is empty because the user hasn't started yet:

- Show 2-3 concrete steps: "1. Create your first [item]. 2. Configure [settings]. 3. Invite your team."
- Link each step to the relevant action.
- Include a "Learn more" link to documentation.
- The guidance disappears once the user has data — it's first-use only.

## Keyboard Shortcut Discovery

Power users rely on keyboard shortcuts. These need to be discoverable:

- Keyboard shortcuts are shown in tooltips for their corresponding actions: "Export (⌘E)"
- A keyboard shortcut cheat sheet is accessible via "?" key (a common convention in data apps).
- The cheat sheet is organized by category: Navigation, Actions, Selection, etc.
- Shortcuts are consistent with platform conventions (⌘ on Mac, Ctrl on Windows/Linux).
