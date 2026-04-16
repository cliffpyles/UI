import { colors } from "../primitives/colors";

export const inputTokens = {
  background: colors.white,
  backgroundDisabled: colors.gray[50],
  text: colors.gray[900],
  textPlaceholder: colors.gray[400],
  border: colors.gray[300],
  borderHover: colors.gray[400],
  borderFocus: colors.blue[600],
  borderError: colors.red[500],
} as const;

export type InputTokens = typeof inputTokens;
