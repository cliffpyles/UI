# Design System Documentation

This directory contains the authoritative documentation for the UI design system. It defines how the system works, how to use it, and how it scales. Every implementation decision should trace back to a principle or specification in these documents.

The system is purpose-built for **data-intensive web applications** — dashboards, analytics tools, admin panels, and enterprise SaaS products where information density, performance, and accessibility are non-negotiable.

## How to Read This Documentation

Start with the foundational documents, then reference patterns and standards as needed.

### Foundational

These define _what_ the system is and _why_ it makes the decisions it does.

| Document | Purpose |
|----------|---------|
| [Principles](./principles.md) | Core design principles and trade-off resolution framework |
| [Architecture](./architecture.md) | Component hierarchy (7 levels), dependency rules, composition model |
| [Tokens](./foundations/tokens.md) | Token architecture: primitive → semantic → component tiers |

### Foundations

These define the visual and structural building blocks that every component references.

| Document | Purpose |
|----------|---------|
| [Typography](./foundations/typography.md) | Type system, tabular numerals, legibility at small sizes |
| [Color](./foundations/color.md) | Semantic colors, categorical palettes, accessibility, dark mode |
| [Spacing & Density](./foundations/spacing-and-density.md) | Density scale, spacing rules, information density management |
| [Layout](./foundations/layout.md) | Data-app layout system, resizable panels, overflow, responsive |
| [Motion](./foundations/motion.md) | Animation principles, transitions, reduced motion |
| [Iconography](./foundations/iconography.md) | Icon strategy, sizing, rendering, usage rules |

### Patterns

These define how to solve recurring interaction and data-display problems.

| Document | Purpose |
|----------|---------|
| [States](./patterns/states.md) | Loading, empty, error, stale, and partial-data states |
| [Data Display](./patterns/data-display.md) | Tables, charts, metrics, and data formatting |
| [Data Entry](./patterns/data-entry.md) | Forms, validation, specialized inputs, complex data entry |
| [Filtering & Search](./patterns/filtering-and-search.md) | Search, filters, query builders, saved views |
| [Navigation & Hierarchy](./patterns/navigation-and-hierarchy.md) | Drill-down, breadcrumbs, master/detail patterns |
| [Real-Time Data](./patterns/real-time-data.md) | Live updates, optimistic UI, staleness indicators |
| [Error Handling](./patterns/error-handling.md) | Error taxonomy, boundaries, retry patterns, partial failure |
| [Export & Sharing](./patterns/export-and-sharing.md) | Export formats, shareable links, print, scheduled reports |
| [Permissions & Access](./patterns/permissions-and-access.md) | Disabled, read-only, restricted, and redacted states |
| [Help & Onboarding](./patterns/help-and-onboarding.md) | Tooltips, progressive disclosure, contextual help |

### Standards

These define cross-cutting requirements and processes.

| Document | Purpose |
|----------|---------|
| [Accessibility](./standards/accessibility.md) | WCAG strategy, dense-UI challenges, keyboard nav, screen readers |
| [Internationalization](./standards/internationalization.md) | Number/date formats, RTL support, text expansion |
| [Theming](./standards/theming.md) | Theme contract, white-labeling, dark mode, runtime theming |
| [Testing](./standards/testing.md) | Visual regression, a11y, cross-browser, data edge cases |
| [API Design](./standards/api-design.md) | Component API conventions, prop patterns, composition rules |
| [Contribution](./standards/contribution.md) | How to propose, evaluate, and add components |

## Relationship to Code

These documents are prescriptive. Code should follow them, not the other way around. When a document and the code disagree, either the code should be updated to match the document, or the document should be updated through the contribution process — never silently ignored.

Design tokens defined in `src/tokens/` are the code-level expression of the foundations documented here. Components in `src/components/` implement the patterns and follow the API design standards.
