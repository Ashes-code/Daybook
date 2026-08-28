import { create } from "zustand";
import { ThemeName } from "../types/entry";

interface ThemeState {
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeName: "brownPaper",
  setTheme: (name) => set({ themeName: name }),
}));
