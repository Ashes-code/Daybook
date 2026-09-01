import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useAuthStore } from "../stores/auth";
import { useEntriesStore } from "../stores/entries";
import { showOfflineToast, showOnlineToast, showSyncSuccessToast } from "../stores/toast";
import { syncPendingOps, fetchRemoteEntries } from "../services/entries";

let wasOnline = true;

export function useNetworkSync() {
  const { user } = useAuthStore();
  const { mergeRemoteEntries } = useEntriesStore();

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

        await syncPendingOps(user.id);

        const remote = await fetchRemoteEntries(user.id);
        if (remote.length > 0) {
          mergeRemoteEntries(remote);
        }

        showSyncSuccessToast();
      }
    });

    NetInfo.fetch().then((state) => {
      wasOnline = state.isConnected === true;
    });

    return () => unsubscribe();
  }, [user]);
}
