import { lightColors } from "../semantic/colors";

export const tableTokens = {
  headerBackground: lightColors.background.surfaceRaised,
  headerText: lightColors.text.secondary,
  rowBackground: lightColors.background.surface,
  rowBackgroundStriped: lightColors.background.surfaceRaised,
  rowBackgroundHover: lightColors.background.surfaceSunken,
  border: lightColors.border.default,
  cellText: lightColors.text.primary,
} as const;

export type TableTokens = typeof tableTokens;
