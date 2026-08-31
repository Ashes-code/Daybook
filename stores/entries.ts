import { create } from "zustand";
import { Entry } from "../types/entry";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_STORAGE_KEY = "daybook-entries";

interface EntriesState {
  entries: Entry[];
  loading: boolean;
  toggleFavorite: (id: string) => void;
  deleteEntry: (id: string) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (entry: Entry) => void;
  getFavorites: () => Entry[];
  loadEntries: () => Promise<void>;
  setEntries: (entries: Entry[]) => void;
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  loading: true,
  toggleFavorite: (id) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, favorited: !e.favorited } : e
      ),
    })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),
  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
    })),
  getFavorites: () => get().entries.filter((e) => e.favorited),
  loadEntries: async () => {
    try {
      const stored = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ entries: parsed, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
  setEntries: (entries) => {
    set({ entries });
    AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries)).catch(() => {});
  },
}));

export const persistEntriesMiddleware = (entries: Entry[]) => {
  AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries)).catch(() => {});
};