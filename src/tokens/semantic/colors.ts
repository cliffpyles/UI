import { colors } from "../primitives/colors";

export const lightColors = {
  background: {
    surface: colors.white,
    surfaceRaised: colors.gray[50],
    surfaceSunken: colors.gray[100],
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[500],
    tertiary: colors.gray[400],
    disabled: colors.gray[300],
  },
  border: {
    default: colors.gray[200],
    strong: colors.gray[300],
  },
  action: {
    primary: colors.blue[600],
    primaryHover: colors.blue[700],
    primaryBg: colors.blue[50],
    secondary: colors.gray[600],
    destructive: colors.red[600],
  },
  focus: {
    ring: "rgba(59, 130, 246, 0.5)",
  },
  status: {
    success: { bg: colors.green[50], text: colors.green[600], icon: colors.green[500] },
    warning: { bg: colors.amber[50], text: colors.amber[700], icon: colors.amber[500] },
    error: { bg: colors.red[50], text: colors.red[700], icon: colors.red[500] },
    info: { bg: colors.blue[50], text: colors.blue[700], icon: colors.blue[500] },
  },
  categorical: [
    colors.blue[500],
    colors.teal[500],
    colors.amber[500],
    colors.purple[500],
    colors.pink[500],
    colors.indigo[500],
    colors.orange[500],
    colors.cyan[500],
  ],
} as const;

export const darkColors = {
  background: {
    surface: colors.gray[900],
    surfaceRaised: colors.gray[800],
    surfaceSunken: colors.gray[950],
    overlay: "rgba(0, 0, 0, 0.7)",
  },
  text: {
    primary: colors.gray[100],
    secondary: colors.gray[400],
    tertiary: colors.gray[500],
    disabled: colors.gray[600],
  },
  border: {
    default: colors.gray[700],
    strong: colors.gray[600],
  },
  action: {
    primary: colors.blue[400],
    primaryHover: colors.blue[300],
    primaryBg: colors.blue[950],
    secondary: colors.gray[300],
    destructive: colors.red[400],
  },
  focus: {
    ring: "rgba(96, 165, 250, 0.5)",
  },
  status: {
    success: { bg: colors.green[950], text: colors.green[400], icon: colors.green[400] },
    warning: { bg: colors.amber[950], text: colors.amber[400], icon: colors.amber[400] },
    error: { bg: colors.red[950], text: colors.red[400], icon: colors.red[400] },
    info: { bg: colors.blue[950], text: colors.blue[400], icon: colors.blue[400] },
  },
  categorical: [
    colors.blue[400],
    colors.teal[400],
    colors.amber[400],
    colors.purple[400],
    colors.pink[400],
    colors.indigo[400],
    colors.orange[400],
    colors.cyan[400],
  ],
} as const;

export type SemanticColors = typeof lightColors;
