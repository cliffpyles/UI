import { fontSize, lineHeight } from "../primitives/typography";

export const semanticTypography = {
  compact: {
    body: { size: fontSize.xs, lineHeight: lineHeight.tight },
    caption: { size: fontSize["2xs"], lineHeight: lineHeight.tight },
    label: { size: fontSize.xs, lineHeight: lineHeight.tight },
    heading: { size: fontSize.sm, lineHeight: lineHeight.tight },
  },
  default: {
    body: { size: fontSize.base, lineHeight: lineHeight.normal },
    caption: { size: fontSize.xs, lineHeight: lineHeight.normal },
    label: { size: fontSize.sm, lineHeight: lineHeight.normal },
    heading: { size: fontSize.lg, lineHeight: lineHeight.tight },
  },
  comfortable: {
    body: { size: fontSize.base, lineHeight: lineHeight.normal },
    caption: { size: fontSize.sm, lineHeight: lineHeight.normal },
    label: { size: fontSize.base, lineHeight: lineHeight.normal },
    heading: { size: fontSize.xl, lineHeight: lineHeight.tight },
  },
} as const;

export type SemanticTypography = typeof semanticTypography;
