---
name: GeolocationInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Input, Icon, Popover]
---

# GeolocationInput

> An address entry with autocomplete suggestions and an optional map preview popover for picking a precise location.

## Purpose
GeolocationInput owns the awkward dance between a free-text address `Input`, an asynchronous geocoding service, and a map confirming the chosen point. It exposes a single `{ address, lat, lng }` value upward and lets consumers swap the geocoder and map renderer without touching the chrome. The component does not bundle a map provider — it accepts a render prop.

## When to use
- Capturing a real-world location with both human-readable address and coordinates
- Forms where the user benefits from autocomplete to disambiguate addresses
- Any field whose downstream value needs lat/lng for routing, mapping, or analytics

## When NOT to use
- Coordinate-only entry without address context → use two `Input`s
- Picking from a small list of saved locations → use **Select**
- Drawing arbitrary geometries (polygons, routes) → out of scope

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for input + map preview | hand-rolled flex / padding in CSS |
| Address entry   | `Input` with `leadingIcon` location pin | raw `<input>` with marker CSS    |
| Suggestion / map panel | `Popover`                     | bespoke floating div                 |
| Pin / status icon | `Icon`                             | inline `<svg>`                       |

## API contract
```ts
interface GeoValue {
  address: string;
  lat: number | null;
  lng: number | null;
}

interface GeoSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

interface GeolocationInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: GeoValue;
  onChange: (next: GeoValue) => void;
  fetchSuggestions: (query: string) => Promise<GeoSuggestion[]>;
  renderMap?: (value: GeoValue, onPick: (lat: number, lng: number) => void) => ReactNode;
  disabled?: boolean;
  placeholder?: string;                 // default "Search address"
}
```
Forwards ref to the root `<div>`.

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| empty        | Placeholder in `Input`; no suggestions; no coordinates                     |
| typing       | `Popover` shows suggestions returned by `fetchSuggestions`                 |
| selected     | `Input` displays chosen address; coordinates set on value                  |
| map-open     | `Popover` switches to the `renderMap` slot for fine adjustment             |
| disabled     | Input disabled; popover suppressed                                         |

## Accessibility
- `Input` uses `aria-autocomplete="list"` with `aria-activedescendant` for the active suggestion
- Map preview area exposes pick interactions via the consumer-provided `renderMap` — that integration MUST surface accessible affordances
- The selected address (text), not the map, is the canonical accessible name of the value

## Tokens
- Inherits all tokens from `Input`, `Popover`
- Adds (component tier): `--geolocation-input-suggestion-row-padding`, `--geolocation-input-map-min-height`

## Do / Don't
```tsx
// DO
<GeolocationInput value={loc} onChange={setLoc} fetchSuggestions={geocode} renderMap={renderMap} />

// DON'T — bake in a map provider
import GoogleMap from "google-maps";   // belongs in the consumer

// DON'T — bespoke suggestion popover
<div className="suggestion-list">…</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Typing triggers `fetchSuggestions` and renders results via `Popover`
- Selecting a suggestion sets `address`, `lat`, `lng` on value
- `renderMap` slot receives the value and `onPick` callback
- Keyboard nav: ArrowUp/Down moves through suggestions, Enter selects, Esc closes
- Forwards ref; spreads remaining props onto root
- Composition probe: `Input`, `Popover`, `Icon` all render inside output
- axe-core passes in default, suggestions-open, selected, disabled
