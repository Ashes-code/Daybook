import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useThemeStore } from "../stores/theme";
import { Colors } from "../constants/theme";
import { useAuthStore, initializeAuth } from "../stores/auth";

export default function RootLayout() {
  const { themeName, initializeTheme } = useThemeStore();
  const theme = Colors[themeName];
  const isDark = themeName === "dark";
  const { user, loading, initialized, setMounted } = useAuthStore();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    const init = async () => {
      setMounted(true);
      await initializeTheme();
      subscription = await initializeAuth();
    };
    
    init();
    
    return () => {
      setMounted(false);
      subscription?.unsubscribe();
    };
  }, [initializeTheme, setMounted]);

  if (!initialized || loading) {
    return (
      <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
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
          }}
        >
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen
            name="signup"
            options={{
              title: "Sign Up",
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="signin"
            options={{
              title: "Sign In",
              presentation: "modal",
              headerShown: false,
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
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="entry/new"
          options={{
            title: "New Entry",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            title: "Day Entries",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="analytics/index"
          options={{
            title: "Analytics",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="favorites/index"
          options={{
            title: "Favorites",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appearance/index"
          options={{
            title: "Appearance",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="about/index"
          options={{
            title: "About",
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
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