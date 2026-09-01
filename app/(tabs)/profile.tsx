import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useAuthStore } from "../../stores/auth";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={[Typography.heading, { color: theme.text }]}>
          Profile
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.accent + "20", borderColor: theme.textSecondary }]}>
          <Ionicons name="person" size={48} color={theme.text} />
        </View>

        {user ? (
          <>
            <Text style={[Typography.body, { color: theme.text }]}>{user.email}</Text>
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.error },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.surface }]}>
                Sign Out
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[Typography.body, { color: theme.textSecondary }]}>
              Sign in to sync your entries across devices
            </Text>
            <Pressable
              onPress={() => router.push("/signin")}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.accent },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.surface }]}>
                Sign In
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {user && (
        <View style={styles.section}>
          <Text style={[Typography.label, { color: theme.textSecondary }]}>
            INSIGHTS
          </Text>

          <Pressable
            onPress={() => router.push("/analytics")}
            style={({ pressed }) => [
              styles.settingsRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="bar-chart-outline" size={20} color={theme.text} />
            <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
              Analytics
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/favorites")}
            style={({ pressed }) => [
              styles.settingsRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="heart-outline" size={20} color={theme.text} />
            <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
              Favorites
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </Pressable>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[Typography.label, { color: theme.textSecondary }]}>
          SETTINGS
        </Text>

        <Pressable
          onPress={() => router.push("/appearance")}
          style={({ pressed }) => [
            styles.settingsRow,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="color-palette-outline" size={20} color={theme.text} />
          <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
            Appearance
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/about")}
          style={({ pressed }) => [
            styles.settingsRow,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="information-circle-outline" size={20} color={theme.text} />
          <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
            About
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: 8,
  },
  buttonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    gap: Spacing.sm,
  },
});