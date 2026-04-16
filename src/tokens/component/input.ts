import { lightColors } from "../semantic/colors";

export const inputTokens = {
  background: lightColors.background.surface,
  backgroundDisabled: lightColors.background.surfaceRaised,
  text: lightColors.text.primary,
  textPlaceholder: lightColors.text.tertiary,
  border: lightColors.border.strong,
  borderHover: lightColors.text.tertiary,
  borderFocus: lightColors.action.primary,
  borderError: lightColors.status.error.icon,
} as const;

export type InputTokens = typeof inputTokens;
