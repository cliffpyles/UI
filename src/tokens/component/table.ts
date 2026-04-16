import { colors } from "../primitives/colors";

export const tableTokens = {
  headerBackground: colors.gray[50],
  headerText: colors.gray[700],
  rowBackground: colors.white,
  rowBackgroundStriped: colors.gray[50],
  rowBackgroundHover: colors.gray[100],
  border: colors.gray[200],
  cellText: colors.gray[900],
} as const;

export type TableTokens = typeof tableTokens;
