/**
 * CSS Token Generator
 *
 * Reads the TypeScript token definitions (the single source of truth) and
 * generates all CSS custom property files:
 *
 *   src/styles/tokens.css          — Primitive tokens
 *   src/styles/themes/light.css    — Light theme semantic tokens
 *   src/styles/themes/dark.css     — Dark theme semantic tokens
 *   src/styles/density/compact.css — Compact density overrides
 *   src/styles/density/comfortable.css — Comfortable density overrides
 *
 * Usage:  npx tsx scripts/generate-css-tokens.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

// — Tier 1: Primitives —
import { colors } from "../src/tokens/primitives/colors.js";
import { spacing } from "../src/tokens/primitives/spacing.js";
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from "../src/tokens/primitives/typography.js";
import { radius } from "../src/tokens/primitives/radius.js";
import { shadows } from "../src/tokens/primitives/shadows.js";
import { duration, easing } from "../src/tokens/primitives/motion.js";
import { zIndex } from "../src/tokens/primitives/z-index.js";

// — Tier 2: Semantic —
import {
  lightColors,
  darkColors,
} from "../src/tokens/semantic/colors.js";
import { semanticSpacing } from "../src/tokens/semantic/spacing.js";
import { semanticTypography } from "../src/tokens/semantic/typography.js";

const STYLES_DIR = resolve(import.meta.dirname, "../src/styles");

// ─── Helpers ──────────────────────────────────────────────────────────

/** Convert a TS token key to a CSS var name fragment: 0.5 → "0-5", "2xs" → "2xs" */
function cssKey(key: string | number): string {
  return String(key).replace(/\./g, "-");
}

/**
 * Reverse-lookup: given a hex value from a semantic token, find which
 * primitive CSS var it maps to, e.g. "#111827" → "var(--color-gray-900)".
 * Returns the raw value (e.g. an rgba string) if no primitive match is found.
 */
function hexToPrimitiveVar(value: string): string {
  // Non-hex values (rgba, transparent, etc.) pass through
  if (!value.startsWith("#")) return value;

  // Check white/black
  if (value === colors.white) return "var(--color-white)";
  if (value === colors.black) return "var(--color-black)";

  // Check each hue
  const hues = [
    "gray", "blue", "green", "red", "amber", "teal",
    "purple", "pink", "indigo", "orange", "cyan",
  ] as const;
  for (const hue of hues) {
    const shades = colors[hue] as Record<number, string>;
    for (const [step, hex] of Object.entries(shades)) {
      if (hex === value) return `var(--color-${hue}-${step})`;
    }
  }

  // Fallback: return raw value (should not happen if tokens are consistent)
  return value;
}

/**
 * Given a spacing value (e.g. "0.25rem"), find which spacing key produced it
 * and return the corresponding CSS var name.
 */
function spacingValueToVar(value: string): string {
  for (const [key, val] of Object.entries(spacing)) {
    if (val === value) return `var(--spacing-${cssKey(key)})`;
  }
  return value;
}

/**
 * Given a fontSize value (e.g. "0.75rem"), find the key and return CSS var.
 */
function fontSizeValueToVar(value: string): string {
  for (const [key, val] of Object.entries(fontSize)) {
    if (val === value) return `var(--font-size-${cssKey(key)})`;
  }
  return value;
}

/**
 * Given a lineHeight value (e.g. 1.25), find the key and return CSS var.
 */
function lineHeightValueToVar(value: number): string {
  for (const [key, val] of Object.entries(lineHeight)) {
    if (val === value) return `var(--font-line-height-${key})`;
  }
  return String(value);
}

function writeFile(relPath: string, content: string) {
  const absPath = resolve(STYLES_DIR, relPath);
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, "utf-8");
  console.log(`  wrote ${relPath}`);
}

// ─── tokens.css — Primitive tokens ────────────────────────────────────

function generatePrimitiveTokens(): string {
  const lines: string[] = [];

  lines.push("/* ==========================================================================");
  lines.push("   Primitive Design Tokens — AUTO-GENERATED from src/tokens/primitives/");
  lines.push("   Do not edit manually. Run: npx tsx scripts/generate-css-tokens.ts");
  lines.push("   ========================================================================== */");
  lines.push("");
  lines.push(":root {");

  // Colors: white, black
  lines.push("  /* ---------- Colors: Base ---------- */");
  lines.push(`  --color-white: ${colors.white};`);
  lines.push(`  --color-black: ${colors.black};`);

  // Colors: each hue
  const hues = [
    "gray", "blue", "green", "red", "amber", "teal",
    "purple", "pink", "indigo", "orange", "cyan",
  ] as const;
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  for (const hue of hues) {
    lines.push("");
    lines.push(`  /* ---------- Colors: ${hue.charAt(0).toUpperCase() + hue.slice(1)} ---------- */`);
    for (const step of steps) {
      lines.push(`  --color-${hue}-${step}: ${colors[hue][step]};`);
    }
  }

  // Spacing — explicit order matching the design spec scale
  const spacingOrder = [
    "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5",
    "4", "5", "6", "7", "8", "10", "12", "14", "16", "20", "24", "32",
  ] as const;
  lines.push("");
  lines.push("  /* ---------- Spacing ---------- */");
  for (const key of spacingOrder) {
    const value = spacing[key as keyof typeof spacing];
    lines.push(`  --spacing-${cssKey(key)}: ${value};`);
  }

  // Typography: font family
  lines.push("");
  lines.push("  /* ---------- Typography: Font Family ---------- */");
  lines.push(`  --font-family-sans: ${fontFamily.sans};`);
  lines.push(`  --font-family-mono: ${fontFamily.mono};`);

  // Typography: font size
  lines.push("");
  lines.push("  /* ---------- Typography: Font Size ---------- */");
  for (const [key, value] of Object.entries(fontSize)) {
    lines.push(`  --font-size-${cssKey(key)}: ${value};`);
  }

  // Typography: font weight
  lines.push("");
  lines.push("  /* ---------- Typography: Font Weight ---------- */");
  for (const [key, value] of Object.entries(fontWeight)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }

  // Typography: line height
  lines.push("");
  lines.push("  /* ---------- Typography: Line Height ---------- */");
  for (const [key, value] of Object.entries(lineHeight)) {
    lines.push(`  --font-line-height-${key}: ${value};`);
  }

  // Border radius
  lines.push("");
  lines.push("  /* ---------- Border Radius ---------- */");
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }

  // Shadows
  lines.push("");
  lines.push("  /* ---------- Shadows ---------- */");
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(`  --shadow-${key}: ${value};`);
  }

  // Motion: duration
  lines.push("");
  lines.push("  /* ---------- Motion: Duration ---------- */");
  for (const [key, value] of Object.entries(duration)) {
    lines.push(`  --duration-${key}: ${value};`);
  }

  // Motion: easing
  lines.push("");
  lines.push("  /* ---------- Motion: Easing ---------- */");
  for (const [key, value] of Object.entries(easing)) {
    lines.push(`  --easing-${key}: ${value};`);
  }

  // Z-index
  lines.push("");
  lines.push("  /* ---------- Z-Index ---------- */");
  lines.push(`  --z-sticky-column: ${zIndex.sticky.column};`);
  lines.push(`  --z-sticky-table-header: ${zIndex.sticky.tableHeader};`);
  lines.push(`  --z-sticky-filter: ${zIndex.sticky.filter};`);
  lines.push(`  --z-sticky-header: ${zIndex.sticky.header};`);
  lines.push(`  --z-dropdown: ${zIndex.dropdown};`);
  lines.push(`  --z-modal: ${zIndex.modal};`);
  lines.push(`  --z-toast: ${zIndex.toast};`);

  lines.push("}");

  // Reduced motion
  lines.push("");
  lines.push("/* ---------- Reduced Motion ---------- */");
  lines.push("@media (prefers-reduced-motion: reduce) {");
  lines.push("  :root {");
  lines.push("    --duration-fast: 0ms;");
  lines.push("    --duration-normal: 0ms;");
  lines.push("    --duration-slow: 0ms;");
  lines.push("    --duration-deliberate: 0ms;");
  lines.push("  }");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

// ─── Theme files — Semantic color tokens ──────────────────────────────

interface SemanticColorSet {
  background: { surface: string; surfaceRaised: string; surfaceSunken: string; overlay: string };
  text: { primary: string; secondary: string; tertiary: string; disabled: string };
  border: { default: string; strong: string };
  action: { primary: string; primaryHover: string; primaryBg: string; secondary: string; destructive: string };
  focus: { ring: string };
  status: {
    success: { bg: string; text: string; icon: string };
    warning: { bg: string; text: string; icon: string };
    error: { bg: string; text: string; icon: string };
    info: { bg: string; text: string; icon: string };
  };
  categorical: readonly string[];
}

function generateThemeCSS(
  themeColors: SemanticColorSet,
  selector: string,
  label: string,
  includeDefaultDensity: boolean,
): string {
  const v = hexToPrimitiveVar;
  const lines: string[] = [];

  lines.push("/* ==========================================================================");
  lines.push(`   ${label} — AUTO-GENERATED from src/tokens/semantic/`);
  lines.push("   Do not edit manually. Run: npx tsx scripts/generate-css-tokens.ts");
  lines.push("   ========================================================================== */");
  lines.push("");
  lines.push(`${selector} {`);

  // Structural
  lines.push("  /* ---------- Structural ---------- */");
  lines.push(`  --color-background-surface: ${v(themeColors.background.surface)};`);
  lines.push(`  --color-background-surface-raised: ${v(themeColors.background.surfaceRaised)};`);
  lines.push(`  --color-background-surface-sunken: ${v(themeColors.background.surfaceSunken)};`);
  lines.push(`  --color-background-overlay: ${themeColors.background.overlay};`);
  lines.push("");
  lines.push(`  --color-text-primary: ${v(themeColors.text.primary)};`);
  lines.push(`  --color-text-secondary: ${v(themeColors.text.secondary)};`);
  lines.push(`  --color-text-tertiary: ${v(themeColors.text.tertiary)};`);
  lines.push(`  --color-text-disabled: ${v(themeColors.text.disabled)};`);
  lines.push("");
  lines.push(`  --color-border-default: ${v(themeColors.border.default)};`);
  lines.push(`  --color-border-strong: ${v(themeColors.border.strong)};`);

  // Action
  lines.push("");
  lines.push("  /* ---------- Action ---------- */");
  lines.push(`  --color-action-primary: ${v(themeColors.action.primary)};`);
  lines.push(`  --color-action-primary-hover: ${v(themeColors.action.primaryHover)};`);
  lines.push(`  --color-action-primary-bg: ${v(themeColors.action.primaryBg)};`);
  lines.push(`  --color-action-secondary: ${v(themeColors.action.secondary)};`);
  lines.push(`  --color-action-destructive: ${v(themeColors.action.destructive)};`);
  lines.push(`  --color-focus-ring: ${themeColors.focus.ring};`);

  // Status
  for (const status of ["success", "warning", "error", "info"] as const) {
    lines.push("");
    lines.push(`  /* ---------- Status: ${status.charAt(0).toUpperCase() + status.slice(1)} ---------- */`);
    lines.push(`  --color-status-${status}-bg: ${v(themeColors.status[status].bg)};`);
    lines.push(`  --color-status-${status}-text: ${v(themeColors.status[status].text)};`);
    lines.push(`  --color-status-${status}-icon: ${v(themeColors.status[status].icon)};`);
  }

  // Categorical
  lines.push("");
  lines.push("  /* ---------- Categorical (Charts / Tags) ---------- */");
  themeColors.categorical.forEach((hex, i) => {
    lines.push(`  --color-categorical-${i + 1}: ${v(hex)};`);
  });

  // Default density (only in light.css since it applies at :root)
  if (includeDefaultDensity) {
    const ds = semanticSpacing.default;
    const dt = semanticTypography.default;
    lines.push("");
    lines.push("  /* ---------- Density: Default ---------- */");
    lines.push(`  --spacing-content-gap: ${spacingValueToVar(ds.contentGap)};`);
    lines.push(`  --spacing-section-gap: ${spacingValueToVar(ds.sectionGap)};`);
    lines.push(`  --spacing-page-padding: ${spacingValueToVar(ds.pagePadding)};`);
    lines.push(`  --spacing-component-padding-x: ${spacingValueToVar(ds.componentPaddingX)};`);
    lines.push(`  --spacing-component-padding-y: ${spacingValueToVar(ds.componentPaddingY)};`);
    lines.push(`  --spacing-inline-gap: ${spacingValueToVar(ds.inlineGap)};`);
    lines.push(`  --font-size-body: ${fontSizeValueToVar(dt.body.size)};`);
    lines.push(`  --font-size-caption: ${fontSizeValueToVar(dt.caption.size)};`);
    lines.push(`  --font-size-label: ${fontSizeValueToVar(dt.label.size)};`);
    lines.push(`  --font-size-heading: ${fontSizeValueToVar(dt.heading.size)};`);
    lines.push(`  --line-height-body: ${lineHeightValueToVar(dt.body.lineHeight)};`);
  }

  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

// ─── Density files ────────────────────────────────────────────────────

function generateDensityCSS(
  densityKey: "compact" | "comfortable",
  label: string,
): string {
  const ds = semanticSpacing[densityKey];
  const dt = semanticTypography[densityKey];
  const lines: string[] = [];

  lines.push("/* ==========================================================================");
  lines.push(`   ${label} — AUTO-GENERATED from src/tokens/semantic/`);
  lines.push("   Do not edit manually. Run: npx tsx scripts/generate-css-tokens.ts");
  lines.push("   ========================================================================== */");
  lines.push("");
  lines.push(`[data-density="${densityKey}"] {`);
  lines.push(`  --spacing-content-gap: ${spacingValueToVar(ds.contentGap)};`);
  lines.push(`  --spacing-section-gap: ${spacingValueToVar(ds.sectionGap)};`);
  lines.push(`  --spacing-page-padding: ${spacingValueToVar(ds.pagePadding)};`);
  lines.push(`  --spacing-component-padding-x: ${spacingValueToVar(ds.componentPaddingX)};`);
  lines.push(`  --spacing-component-padding-y: ${spacingValueToVar(ds.componentPaddingY)};`);
  lines.push(`  --spacing-inline-gap: ${spacingValueToVar(ds.inlineGap)};`);
  lines.push(`  --font-size-body: ${fontSizeValueToVar(dt.body.size)};`);
  lines.push(`  --font-size-caption: ${fontSizeValueToVar(dt.caption.size)};`);
  lines.push(`  --font-size-label: ${fontSizeValueToVar(dt.label.size)};`);
  lines.push(`  --font-size-heading: ${fontSizeValueToVar(dt.heading.size)};`);
  lines.push(`  --line-height-body: ${lineHeightValueToVar(dt.body.lineHeight)};`);
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────

console.log("Generating CSS tokens from TypeScript definitions...\n");

writeFile("tokens.css", generatePrimitiveTokens());

writeFile(
  "themes/light.css",
  generateThemeCSS(
    lightColors as unknown as SemanticColorSet,
    `:root,\n[data-theme="light"]`,
    "Light Theme — Semantic Tokens",
    true,
  ),
);

writeFile(
  "themes/dark.css",
  generateThemeCSS(
    darkColors as unknown as SemanticColorSet,
    `[data-theme="dark"]`,
    "Dark Theme — Semantic Tokens",
    false,
  ),
);

writeFile(
  "density/compact.css",
  generateDensityCSS("compact", "Compact Density"),
);

writeFile(
  "density/comfortable.css",
  generateDensityCSS("comfortable", "Comfortable Density"),
);

console.log("\nDone. All CSS files generated from src/tokens/.");
