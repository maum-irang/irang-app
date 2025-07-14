import { colors } from "./colors";

export const semantic = {
  color: colors.system.white,

  status: {
    success: colors.solid.green,
    successTranslucent: colors.solid.green,
    danger: colors.solid.red,
    dangerTranslucent: colors.solid.red,
    warning: colors.solid.yellow,
    warningTranslucent: colors.solid.yellow,
  },

  fill: {
    primary: colors.grayscale[50],
    secondary: colors.grayscale[100],
    tertiary: colors.grayscale[200],
    invert: colors.grayscale[800],
  },

  accent: {
    primary: colors.core[300],
    transparent: colors.core[100],
  },

  stroke: {
    primary: colors.grayscale[100],
    secondary: colors.grayscale[200],
    tertiary: colors.grayscale[300],
  },

  content: {
    primary: colors.grayscale[600],
    secondary: colors.grayscale[300],
    tertiary: colors.grayscale[200],
    invert: colors.grayscale[0],
  },

  background: {
    primary: colors.grayscale[0],
    secondary: colors.grayscale[50],
    tertiary: colors.grayscale[100],
    quaternary: colors.grayscale[200],
  },
} as const;
