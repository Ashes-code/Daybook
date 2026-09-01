import { create } from "zustand";
import { Entry } from "../types/entry";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_STORAGE_KEY = "daybook-entries";

interface EntriesState {
  entries: Entry[];
  loading: boolean;
  addEntry: (entry: Entry) => void;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setEntries: (entries: Entry[]) => void;
  mergeRemoteEntries: (remote: Entry[]) => void;
  loadEntries: () => Promise<void>;
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  loading: true,

  addEntry: (entry) =>
    set((state) => {
      const updated = [entry, ...state.entries];
      AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return { entries: updated };
    }),

  updateEntry: (entry) =>
    set((state) => {
      const updated = state.entries.map((e) => (e.id === entry.id ? entry : e));
      AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return { entries: updated };
    }),

  deleteEntry: (id) =>
    set((state) => {
      const updated = state.entries.filter((e) => e.id !== id);
      AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return { entries: updated };
    }),

  toggleFavorite: (id) =>
    set((state) => {
      const updated = state.entries.map((e) =>
        e.id === id ? { ...e, favorited: !e.favorited } : e
      );
      AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return { entries: updated };
    }),

  setEntries: (entries) => {
    set({ entries });
    AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries)).catch(() => {});
  },

  mergeRemoteEntries: (remote) =>
    set((state) => {
      const remoteIds = new Set(remote.map((e) => e.id));
      const localOnly = state.entries.filter((e) => !remoteIds.has(e.id));
      const merged = [...localOnly, ...remote];
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
      return { entries: merged };
    }),

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
}));
