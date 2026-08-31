import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "offline" | "online";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type: Toast["type"], duration?: number) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type, duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const showOfflineToast = () => useToastStore.getState().showToast("You're offline. Changes will sync when online.", "offline", 0);
export const showOnlineToast = () => useToastStore.getState().showToast("Back online. Syncing...", "online", 2000);
export const showSyncSuccessToast = () => useToastStore.getState().showToast("Synced successfully", "success", 2000);