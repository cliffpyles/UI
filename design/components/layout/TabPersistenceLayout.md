---
name: TabPersistenceLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy]
uses: [Box, Tabs, Button, Icon]
replaces-raw: []
---

# TabPersistenceLayout

> A browser-style tab strip that keeps multiple views open in parallel and lets the user reorder, close, and pin tabs.

## Purpose
TabPersistenceLayout brings the multi-tab work pattern users know from browsers and IDEs into the product — analysts can keep three queries open, pin a reference dashboard, and reorder tabs as their attention shifts. It composes over `Tabs` for the panel-switching contract, then layers per-tab close `Button`s, a "new tab" `Icon` `Button`, drag-to-reorder, and pinned-tab persistence. The layout itself does not own the tab data model; it renders what the caller provides.

## When to use
- Multi-document workspaces (queries, notebooks, reports) where users keep several open
- Analytical tools where context-switching between views must preserve in-tab state
- Apps that want a stable "open documents" surface across sessions

## When NOT to use
- Mutually exclusive panels of the same entity → use **Tabs**
- Section sub-navigation tied to routes → use **ContextualSubNav**
- A small, fixed set of tabs with no open/close → use **Tabs**

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="column">`                    | hand-rolled flex CSS                          |
| Tab strip             | `Tabs` for the active-state and panel switch | hand-rolled active state + panel mounting     |
| Tab strip row         | `Box direction="row" align="center">`        | hand-rolled flex CSS                          |
| Per-tab close affordance | `Button variant="ghost" size="xs">` + `Icon name="x">` | raw `<button>` with inline `<svg>` |
| New-tab affordance    | `Button variant="ghost">` + `Icon name="plus">` | raw `<button>` with inline `<svg>`        |
| Pin glyph             | `Icon name="pin">` inside the tab            | inline `<svg>` pin                            |

## API contract
```ts
interface OpenTab {
  id: string;
  title: string;
  pinned?: boolean;
  dirty?: boolean;                // unsaved changes indicator
  content: ReactNode;
}

interface TabPersistenceLayoutProps extends HTMLAttributes<HTMLDivElement> {
  tabs: OpenTab[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onReorder?: (nextOrder: string[]) => void;
  onNewTab?: () => void;
  onTogglePin?: (id: string) => void;
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | Tabs rendered in order; `activeId` panel rendered                     |
| pinned          | Pinned tabs sort first; close affordance hidden, pin glyph shown      |
| dirty           | Tab title shows a dot indicator; close prompts confirmation           |
| reordering      | When dragging, drop targets indicated by token-driven outline         |
| empty           | No tabs → empty state with "New tab" button                           |

## Accessibility
- Inherits tablist semantics from `Tabs`; each tab is a `tab`, panel is a `tabpanel`
- Close button on each tab carries `aria-label="Close <title>"`
- New-tab button carries `aria-label="New tab"`
- Pinned state announced via `aria-pressed` on the pin trigger (when present)
- Reorder operations are keyboard accessible (Ctrl/Cmd + Arrow)

## Tokens
- Inherits Tabs and Button tokens
- Adds (component tier): `--tab-persistence-tab-min-width`, `--tab-persistence-tab-max-width`, `--tab-persistence-strip-gap`, `--tab-persistence-dirty-dot-size`

## Do / Don't
```tsx
// DO
<TabPersistenceLayout
  tabs={openTabs}
  activeId={activeId}
  onActivate={setActive}
  onClose={closeTab}
  onNewTab={newTab}
  onTogglePin={togglePin}
/>

// DON'T — bypass Tabs
<div className="tabs">{tabs.map(t => <div onClick={…}>{t.title}</div>)}</div>

// DON'T — raw close button + svg
<button onClick={close}><svg>…</svg></button>

// DON'T — render the pin as a unicode glyph
<span>📌</span>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `TabPersistenceLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `tabs` render in order; pinned tabs sort first
- Activating a tab calls `onActivate`; the matching panel is the only one rendered
- Close button calls `onClose`; close hidden on pinned tabs
- New-tab button calls `onNewTab`
- Dirty tabs show the indicator
- Composition probes: `Tabs` is the panel switcher; `Button` + `Icon` render close / new-tab / pin
- Forwards ref; spreads remaining props onto root
- axe-core passes with single, multiple, pinned, and dirty tabs
