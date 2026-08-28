import { View, Text, Pressable, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

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
        <View style={[styles.avatar, { backgroundColor: theme.accent + "20" }]}>
          <Ionicons name="person" size={48} color={theme.accent} />
        </View>
        <Text style={[Typography.body, { color: theme.textSecondary }]}>
          Sign in to sync your entries across devices
        </Text>
        <Pressable
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
      </View>

      <View style={styles.section}>
        <Text style={[Typography.label, { color: theme.textSecondary }]}>
          INSIGHTS
        </Text>

        <Pressable
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

      <View style={styles.section}>
        <Text style={[Typography.label, { color: theme.textSecondary }]}>
          SETTINGS
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.settingsRow,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="moon-outline" size={20} color={theme.text} />
          <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
            Appearance
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.settingsRow,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="notifications-outline" size={20} color={theme.text} />
          <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.settingsRow,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="help-circle-outline" size={20} color={theme.text} />
          <Text style={[Typography.body, { color: theme.text, flex: 1 }]}>
            About
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </Pressable>
      </View>

      <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: "center" }]}>
        Daybook v1.0.0
      </Text>
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
