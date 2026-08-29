import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "../stores/theme";
import { Colors } from "../constants/theme";

export default function RootLayout() {
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const isDark = themeName === "dark";

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
        <Stack.Screen
          name="welcome"
          options={{
            title: "Welcome",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: "Sign Up",
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
