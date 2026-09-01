import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useThemeStore } from "../stores/theme";
import { Colors } from "../constants/theme";
import { useAuthStore, initializeAuth } from "../stores/auth";
import { useEntriesStore } from "../stores/entries";
import { ToastContainer } from "../components/Toast";
import { useNetworkSync } from "../hooks/useNetworkSync";
import { fetchRemoteEntries, syncPendingOps } from "../services/entries";
import NetInfo from "@react-native-community/netinfo";

export default function RootLayout() {
  const { themeName, initializeTheme } = useThemeStore();
  const theme = Colors[themeName];
  const isDark = themeName === "dark";
  const { user, loading, initialized } = useAuthStore();
  const { loadEntries, mergeRemoteEntries } = useEntriesStore();

  useNetworkSync();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    const init = async () => {
      await initializeTheme();
      subscription = await initializeAuth();
    };
    
    init();
    
    const fallback = setTimeout(() => {
      const { initialized } = useAuthStore.getState();
      if (!initialized) {
        useAuthStore.getState().setLoading(false);
        useAuthStore.getState().setInitialized(true);
      }
    }, 5000);
    
    return () => {
      clearTimeout(fallback);
      subscription?.unsubscribe();
    };
  }, [initializeTheme]);

  useEffect(() => {
    if (!user) return;

    const loadAndSync = async () => {
      await loadEntries();
      const net = await NetInfo.fetch();
      if (net.isConnected) {
        await syncPendingOps(user.id);
        const remote = await fetchRemoteEntries(user.id);
        if (remote.length > 0) {
          mergeRemoteEntries(remote);
        }
      }
    };

    loadAndSync();
  }, [user, loadEntries, mergeRemoteEntries]);

  if (!initialized || loading) {
    return (
      <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.spinner} />
        </View>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.background },
            headerShown: false,
          }}
        >
          <Stack.Screen name="welcome" />
          <Stack.Screen
            name="signup"
            options={{
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="signin"
            options={{
              presentation: "modal",
            }}
          />
        </Stack>
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="entry/new"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="analytics/index"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="favorites/index"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="appearance/index"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="about/index"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
      <ToastContainer />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});