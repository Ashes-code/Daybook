import { create } from "zustand";
import { ThemeName } from "../types/entry";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "daybook-theme";

interface ThemeState {
  themeName: ThemeName;
  setTheme: (name: ThemeName) => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeName: "brownPaper",
  setTheme: async (name) => {
    set({ themeName: name });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
  },
  initializeTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === "brownPaper" || stored === "dark" || stored === "light")) {
        set({ themeName: stored as ThemeName });
      }
    } catch {
      // Ignore storage errors
    }
  },
}));