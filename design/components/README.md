# Component Specifications

This directory holds the per-component contract for every component in the system. **Each spec is the source of truth for that component.** When code and spec disagree, code is wrong.

## Layout

```
design/components/
  primitive/          # Level 2: Text, Box, Icon, Divider, Badge, Dot, Spinner, VisuallyHidden
  base/               # Level 3: Button, Input, Checkbox, Radio, Toggle, Select, Tag, Avatar, Tooltip, Skeleton
  composite/          # Level 4: FormField, Modal, Dropdown, Card, Tabs, Accordion, Pagination, SearchInput
  domain/             # Level 5: MetricCard, StatusBadge, DataTable, ...
  layout/             # Level 6: AppShell, DashboardFrame, MasterDetailLayout, ...
  _template.md        # Canonical spec template — copy when authoring a new spec
  INDEX.md            # Generated inverse index (uses → used-by). Do not edit by hand.
  README.md           # This file
```

Filenames: `<ComponentName>.md` matching the React component name exactly. One spec per component.

## Ambient rules

Every spec assumes these documents and only spells out *deviations* or *per-component contracts*. Do not restate them in individual specs.

- [architecture.md](../architecture.md) — 7-level hierarchy, dependency rules, composition-first rule
- [standards/api-design.md](../standards/api-design.md) — prop naming, ref forwarding, prop spreading, named exports
- [foundations/tokens.md](../foundations/tokens.md) — 3-tier token system, token tier permitted at each component tier
- [standards/accessibility.md](../standards/accessibility.md) — WCAG baseline, keyboard, screen reader expectations
- [standards/testing.md](../standards/testing.md) — test coverage requirements, axe-core, edge cases

## Authoring a spec

1. Copy `_template.md` to `design/components/<tier>/<ComponentName>.md`.
2. Fill every section. Empty sections mean "no requirement" — be explicit if so (`None` is acceptable).
3. The `uses:` frontmatter list is enforced by `.claude/hooks/spec-check.sh`. Every component listed there must be imported and used in the implementation.
4. The `Forbidden patterns` block is enforced by `.claude/hooks/composition-check.sh` (universal patterns) and may be extended per-spec as additional grep rules are added to the hook.
5. After authoring or changing a spec, regenerate the inverse index:
   ```
   node scripts/generate-component-index.mjs
   ```

## Enforcement model

| Check | Where | Behavior |
|-------|-------|----------|
| Universal forbidden patterns (raw `<button>`, `<input>`, `onClick` on div, hardcoded colors, …) | `composition-check.sh` | Hard fail (exit 2) on edit |
| `uses:` contract — every listed component must be imported | `spec-check.sh` | Hard fail when spec exists; warn-only when spec is missing |
| Spec exists for every component file | `spec-check.sh` | Warn-only (gradual coverage) |
| TypeScript prop drift from spec API contract | tsc + manual review | Author must update spec before changing the `interface` block |

## Working with specs from a session

When implementing or modifying a component, **read the matching spec first**. The spec defines what the component is, what it composes from, what states it must handle, and what patterns are forbidden. Do not derive these decisions independently — they are already made.

When a spec is missing, author one before writing component code. The template is short by design; filling it forces the composition decision before any line of `.tsx` is written.
