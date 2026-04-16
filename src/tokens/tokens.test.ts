import { describe, expect, it } from "vitest";
import {
  colors,
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  shadows,
  duration,
  easing,
  zIndex,
} from "./primitives";
import { lightColors, darkColors, semanticSpacing, semanticTypography } from "./semantic";
import { lightTheme, darkTheme } from "./contract";
import type { ThemeContract } from "./contract";

describe("primitive tokens", () => {
  const hues = ["gray", "blue", "green", "red", "amber", "teal", "purple", "pink", "indigo", "orange", "cyan"] as const;
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  it("defines all color hues with 50-950 steps", () => {
    for (const hue of hues) {
      for (const step of steps) {
        expect(colors[hue][step]).toBeDefined();
        expect(colors[hue][step]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("defines white and black", () => {
    expect(colors.white).toBe("#ffffff");
    expect(colors.black).toBe("#000000");
  });

  it("defines spacing scale with expected values", () => {
    expect(spacing[0]).toBe("0");
    expect(spacing.px).toBe("1px");
    expect(spacing[1]).toBe("0.25rem");
    expect(spacing[4]).toBe("1rem");
    expect(spacing[8]).toBe("2rem");
    expect(spacing[32]).toBe("8rem");
  });

  it("defines complete font size scale from 2xs to 4xl", () => {
    expect(fontSize["2xs"]).toBe("0.625rem");
    expect(fontSize.xs).toBe("0.75rem");
    expect(fontSize.sm).toBe("0.875rem");
    expect(fontSize.base).toBe("1rem");
    expect(fontSize.lg).toBe("1.125rem");
    expect(fontSize.xl).toBe("1.25rem");
    expect(fontSize["2xl"]).toBe("1.5rem");
    expect(fontSize["3xl"]).toBe("1.875rem");
    expect(fontSize["4xl"]).toBe("2.25rem");
  });

  it("defines font families", () => {
    expect(fontFamily.sans).toContain("system-ui");
    expect(fontFamily.mono).toContain("monospace");
  });

  it("defines font weights", () => {
    expect(fontWeight.normal).toBe(400);
    expect(fontWeight.medium).toBe(500);
    expect(fontWeight.semibold).toBe(600);
    expect(fontWeight.bold).toBe(700);
  });

  it("defines line heights", () => {
    expect(lineHeight.tight).toBe(1.25);
    expect(lineHeight.normal).toBe(1.5);
    expect(lineHeight.relaxed).toBe(1.75);
  });

  it("defines radius scale", () => {
    expect(radius.none).toBe("0");
    expect(radius.sm).toBeDefined();
    expect(radius.md).toBeDefined();
    expect(radius.lg).toBeDefined();
    expect(radius.xl).toBeDefined();
    expect(radius.full).toBe("9999px");
  });

  it("defines shadow scale", () => {
    expect(shadows.none).toBe("none");
    expect(shadows.sm).toBeDefined();
    expect(shadows.md).toBeDefined();
    expect(shadows.lg).toBeDefined();
    expect(shadows.overlay).toBeDefined();
  });

  it("defines motion tokens", () => {
    expect(duration.instant).toBe("0ms");
    expect(duration.fast).toBe("100ms");
    expect(duration.normal).toBe("200ms");
    expect(duration.slow).toBe("300ms");
    expect(duration.deliberate).toBe("500ms");

    expect(easing.default).toContain("cubic-bezier");
    expect(easing.enter).toContain("cubic-bezier");
    expect(easing.exit).toContain("cubic-bezier");
    expect(easing.linear).toBe("linear");
  });

  it("defines z-index layers", () => {
    expect(zIndex.sticky.column).toBe(70);
    expect(zIndex.sticky.tableHeader).toBe(80);
    expect(zIndex.sticky.filter).toBe(90);
    expect(zIndex.sticky.header).toBe(100);
    expect(zIndex.dropdown).toBe(200);
    expect(zIndex.modal).toBe(300);
    expect(zIndex.toast).toBe(400);
  });
});

describe("semantic tokens", () => {
  it("maps every semantic color to a valid primitive", () => {
    // Light structural colors should be hex strings
    expect(lightColors.background.surface).toMatch(/^#[0-9a-f]{6}$/);
    expect(lightColors.text.primary).toMatch(/^#[0-9a-f]{6}$/);
    expect(lightColors.border.default).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("defines light and dark values for every semantic token", () => {
    // Deep structural parity check: every key path in lightColors exists in darkColors
    function getKeyPaths(obj: Record<string, unknown>, prefix = ""): string[] {
      const paths: string[] = [];
      for (const key of Object.keys(obj)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        const val = obj[key];
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
          paths.push(...getKeyPaths(val as Record<string, unknown>, fullPath));
        } else {
          paths.push(fullPath);
        }
      }
      return paths;
    }

    const lightPaths = getKeyPaths(lightColors as unknown as Record<string, unknown>).sort();
    const darkPaths = getKeyPaths(darkColors as unknown as Record<string, unknown>).sort();
    expect(lightPaths).toEqual(darkPaths);

    // Status colors have bg, text, icon
    for (const status of ["success", "warning", "error", "info"] as const) {
      expect(lightColors.status[status].bg).toBeDefined();
      expect(lightColors.status[status].text).toBeDefined();
      expect(lightColors.status[status].icon).toBeDefined();
      expect(darkColors.status[status].bg).toBeDefined();
      expect(darkColors.status[status].text).toBeDefined();
      expect(darkColors.status[status].icon).toBeDefined();
    }
  });

  it("defines 8 categorical colors for both themes", () => {
    expect(lightColors.categorical).toHaveLength(8);
    expect(darkColors.categorical).toHaveLength(8);
  });

  it("defines compact/default/comfortable for density tokens", () => {
    const densities = ["compact", "default", "comfortable"] as const;
    for (const d of densities) {
      expect(semanticSpacing[d].contentGap).toBeDefined();
      expect(semanticSpacing[d].sectionGap).toBeDefined();
      expect(semanticSpacing[d].pagePadding).toBeDefined();
      expect(semanticSpacing[d].componentPaddingX).toBeDefined();
      expect(semanticSpacing[d].componentPaddingY).toBeDefined();
      expect(semanticSpacing[d].inlineGap).toBeDefined();
    }
  });

  it("defines typography per density", () => {
    const densities = ["compact", "default", "comfortable"] as const;
    for (const d of densities) {
      expect(semanticTypography[d].body.size).toBeDefined();
      expect(semanticTypography[d].caption.size).toBeDefined();
      expect(semanticTypography[d].label.size).toBeDefined();
      expect(semanticTypography[d].heading.size).toBeDefined();
    }
  });
});

describe("theme contract", () => {
  function getContractKeys(): (keyof ThemeContract)[] {
    return Object.keys(lightTheme) as (keyof ThemeContract)[];
  }

  it("light theme satisfies the full contract", () => {
    const keys = getContractKeys();
    for (const key of keys) {
      expect(lightTheme[key]).toBeDefined();
      expect(typeof lightTheme[key]).toBe("string");
    }
  });

  it("dark theme satisfies the full contract", () => {
    const keys = getContractKeys();
    for (const key of keys) {
      expect(darkTheme[key]).toBeDefined();
      expect(typeof darkTheme[key]).toBe("string");
    }
  });

  it("no semantic token resolves to undefined in either theme", () => {
    const keys = getContractKeys();
    for (const key of keys) {
      expect(lightTheme[key]).not.toBeUndefined();
      expect(darkTheme[key]).not.toBeUndefined();
      expect(lightTheme[key]).not.toBe("");
      expect(darkTheme[key]).not.toBe("");
    }
  });

  it("both themes define the same set of keys", () => {
    const lightKeys = Object.keys(lightTheme).sort();
    const darkKeys = Object.keys(darkTheme).sort();
    expect(lightKeys).toEqual(darkKeys);
  });
});
