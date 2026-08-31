import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/auth";
import { useEntriesStore } from "../stores/entries";
import { useToastStore, showOfflineToast, showOnlineToast, showSyncSuccessToast } from "../stores/toast";
import { syncEntries, fetchRemoteEntries, mergeEntries, queueOperation } from "../services/sync";

let wasOnline = true;

export function useNetworkSync() {
  const { user } = useAuthStore();
  const { entries, setEntries, loadEntries } = useEntriesStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isOnline = state.isConnected === true;
      
      if (!isOnline && wasOnline) {
        showOfflineToast();
        wasOnline = false;
      } else if (isOnline && !wasOnline) {
        showOnlineToast();
        wasOnline = true;
        
        // Sync pending operations
        await syncEntries(user.id);
        
        // Fetch remote and merge
        const remote = await fetchRemoteEntries(user.id);
        if (remote.length > 0) {
          const merged = await mergeEntries(entries, remote);
          setEntries(merged);
          await loadEntries();
        }
        
        showSyncSuccessToast();
      }
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      wasOnline = state.isConnected === true;
    });

    return () => unsubscribe();
  }, [user, entries, setEntries, loadEntries]);
}

export async function createEntryOffline(entry: any) {
  const { useEntriesStore } = await import("../stores/entries");
  const { addEntry } = useEntriesStore.getState();
  addEntry(entry);
  await queueOperation("create", entry);
}

export async function updateEntryOffline(entry: any) {
  const { useEntriesStore } = await import("../stores/entries");
  const { updateEntry } = useEntriesStore.getState();
  updateEntry(entry);
  await queueOperation("update", entry);
}

export async function deleteEntryOffline(entry: any) {
  const { useEntriesStore } = await import("../stores/entries");
  const { deleteEntry } = useEntriesStore.getState();
  deleteEntry(entry.id);
  await queueOperation("delete", entry);
}