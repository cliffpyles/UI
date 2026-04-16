import { spacing } from "../primitives/spacing";

export const semanticSpacing = {
  compact: {
    contentGap: spacing[1],
    sectionGap: spacing[3],
    pagePadding: spacing[3],
    componentPaddingX: spacing[2],
    componentPaddingY: spacing[1],
    inlineGap: spacing[1],
  },
  default: {
    contentGap: spacing[3],
    sectionGap: spacing[6],
    pagePadding: spacing[6],
    componentPaddingX: spacing[4],
    componentPaddingY: spacing[2],
    inlineGap: spacing[2],
  },
  comfortable: {
    contentGap: spacing[4],
    sectionGap: spacing[8],
    pagePadding: spacing[8],
    componentPaddingX: spacing[5],
    componentPaddingY: spacing[2.5],
    inlineGap: spacing[2],
  },
} as const;

export type SemanticSpacing = typeof semanticSpacing;
export type Density = keyof SemanticSpacing;
