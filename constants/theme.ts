import { Platform } from "react-native";

export const Colors = {
  light: {
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
  },
  dark: {
    background: "#1A1714",
    surface: "#2A2520",
    text: "#F5F0E8",
    textSecondary: "#9E968E",
    border: "#3A3530",
    accent: "#B8A694",
    accentLight: "#3A3530",
    error: "#E74C3C",
    separator: "#2A2520",
    tabActive: "#E8A87C",
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
