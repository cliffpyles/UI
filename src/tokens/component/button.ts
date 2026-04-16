import { colors } from "../primitives/colors";
import { spacing } from "../primitives/spacing";

export const buttonTokens = {
  primary: {
    background: colors.blue[600],
    backgroundHover: colors.blue[700],
    text: colors.white,
    border: colors.blue[600],
    borderHover: colors.blue[700],
  },
  secondary: {
    background: colors.white,
    backgroundHover: colors.gray[100],
    text: colors.gray[800],
    border: colors.gray[300],
    borderHover: colors.gray[400],
  },
  ghost: {
    background: "transparent",
    backgroundHover: colors.gray[100],
    text: colors.gray[800],
    border: "transparent",
    borderHover: "transparent",
  },
  destructive: {
    background: colors.red[600],
    backgroundHover: colors.red[700],
    text: colors.white,
    border: colors.red[600],
    borderHover: colors.red[700],
  },
  size: {
    sm: { paddingX: spacing[3], paddingY: spacing[1.5], fontSize: "0.875rem" },
    md: { paddingX: spacing[4], paddingY: spacing[2], fontSize: "1rem" },
    lg: { paddingX: spacing[5], paddingY: spacing[2.5], fontSize: "1.125rem" },
  },
} as const;

export type ButtonTokens = typeof buttonTokens;
