import { Platform } from "react-native";
import { ThemeName } from "../types/entry";

export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentLight: string;
  error: string;
  separator: string;
  tabActive: string;
  spinner: string;
  surfaceSecondary?: string; 
  accentSecondary?: string;
};

export const Colors: Record<ThemeName, ThemeColors> = {
  brownPaper: {
    background: "#FAF8F5",
    surface: "#FFFFFF",
    text: "#1A1714",
    textSecondary: "#6B6560",
    border: "#E8E2DA",
    accent: "#8C7A6B",
    accentLight: "#D9CFC5",
    error: "#C0392B",
    separator: "#F0EBE4",
    tabActive: "#A0522D",
    spinner: "#8C7A6B",
  },
  dark: {
    background: "#000000",
    surface: "#1A1A1A",
    surfaceSecondary: "#f2eded",
    text: "#FFFFFF",
    textSecondary: "#A0A0A0",
    border: "#2A2A2A",
    accent: "#FFFFFF",
    accentSecondary: "#ede8e8",
    accentLight: "#333333",
    error: "#FF4444",
    separator: "#1A1A1A",
    tabActive: "#FFFFFF",
    spinner: "#ffffff",
  },
  light: {
    background: "#F8F9FA",
    surface: "#FFFFFF",
    text: "#1A1A1A",
    textSecondary: "#6C757D",
    border: "#E9ECEF",
    accent: "#4A90D9",
    accentLight: "#E8F0FE",
    error: "#DC3545",
    separator: "#F1F3F5",
    tabActive: "#4A90D9",
    spinner: "#4A90D9",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = Platform.select({
  ios: {
    body: { fontFamily: "System", fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: "System", fontSize: 14, lineHeight: 20 },
    heading: { fontFamily: "System", fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
    headingSmall: { fontFamily: "System", fontSize: 18, lineHeight: 26, fontWeight: "600" as const },
    label: { fontFamily: "System", fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
  },
  android: {
    body: { fontFamily: "normal", fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: "normal", fontSize: 14, lineHeight: 20 },
    heading: { fontFamily: "normal", fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
    headingSmall: { fontFamily: "normal", fontSize: 18, lineHeight: 26, fontWeight: "600" as const },
    label: { fontFamily: "normal", fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
  },
  default: {
    body: { fontFamily: "System", fontSize: 16, lineHeight: 24 },
    bodySmall: { fontFamily: "System", fontSize: 14, lineHeight: 20 },
    heading: { fontFamily: "System", fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
    headingSmall: { fontFamily: "System", fontSize: 18, lineHeight: 26, fontWeight: "600" as const },
    label: { fontFamily: "System", fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
  },
});
