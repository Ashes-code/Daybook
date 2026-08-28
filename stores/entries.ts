import { create } from "zustand";
import { Entry } from "../types/entry";
import { MOCK_ENTRIES } from "../lib/mock";

interface EntriesState {
  entries: Entry[];
  toggleFavorite: (id: string) => void;
  deleteEntry: (id: string) => void;
  getFavorites: () => Entry[];
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: MOCK_ENTRIES.map((e) => ({ ...e, favorited: false })),
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
  getFavorites: () => get().entries.filter((e) => e.favorited),
}));
