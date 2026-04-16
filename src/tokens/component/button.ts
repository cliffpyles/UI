import { colors } from "../primitives/colors";
import { spacing } from "../primitives/spacing";
import { fontSize } from "../primitives/typography";
import { lightColors } from "../semantic/colors";

export const buttonTokens = {
  primary: {
    background: lightColors.action.primary,
    backgroundHover: lightColors.action.primaryHover,
    text: colors.white,
    border: lightColors.action.primary,
    borderHover: lightColors.action.primaryHover,
  },
  secondary: {
    background: lightColors.background.surface,
    backgroundHover: lightColors.background.surfaceSunken,
    text: lightColors.text.primary,
    border: lightColors.border.strong,
    borderHover: colors.gray[400],
  },
  ghost: {
    background: "transparent",
    backgroundHover: lightColors.background.surfaceSunken,
    text: lightColors.text.primary,
    border: "transparent",
    borderHover: "transparent",
  },
  destructive: {
    background: lightColors.action.destructive,
    backgroundHover: colors.red[700],
    text: colors.white,
    border: lightColors.action.destructive,
    borderHover: colors.red[700],
  },
  size: {
    sm: { paddingX: spacing[3], paddingY: spacing[1.5], fontSize: fontSize.sm },
    md: { paddingX: spacing[4], paddingY: spacing[2], fontSize: fontSize.base },
    lg: { paddingX: spacing[5], paddingY: spacing[2.5], fontSize: fontSize.lg },
  },
} as const;

export type ButtonTokens = typeof buttonTokens;
