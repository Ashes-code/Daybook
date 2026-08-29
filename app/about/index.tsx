import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.heading, { color: theme.text, flex: 1, textAlign: "center" }]}>
          About
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
            <Ionicons name="book" size={48} color={theme.accent} />
          </View>
        </View>

        <Text style={[styles.appName, { color: theme.text }]}>Daybook</Text>
        <Text style={[styles.version, { color: theme.textSecondary }]}>v1.0.0</Text>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.description, { color: theme.text }]}>
            Daybook turns a paper journal into a calm phone experience.
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.separator }]} />

          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            You think in days, not folders of random notes. You can write more than once per day. The app feels personal with mood tracking and a soft UI, not like a work notes tool.
          </Text>

          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Your diary is yours across devices with secure cloud sync. Write on your phone, read on your tablet, all your thoughts always available.
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.separator }]} />

          <View style={styles.featureRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.accent} />
            <Text style={[styles.featureText, { color: theme.text }]}>Day-first navigation</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="create-outline" size={20} color={theme.accent} />
            <Text style={[styles.featureText, { color: theme.text }]}>Multiple entries per day</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="heart-outline" size={20} color={theme.accent} />
            <Text style={[styles.featureText, { color: theme.text }]}>Mood tracking</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="search-outline" size={20} color={theme.accent} />
            <Text style={[styles.featureText, { color: theme.text }]}>Full-text search</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="cloud-outline" size={20} color={theme.accent} />
            <Text style={[styles.featureText, { color: theme.text }]}>Cloud sync function.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Made with care for journalers everywhere
        </Text>
        <Text style={[styles.footerVersion, { color: theme.textSecondary }]}>
          Daybook v1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing.sm,
    minWidth: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
    marginTop: Spacing.md,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    ...Typography.heading,
    fontSize: 28,
    textAlign: "center",
  },
  version: {
    ...Typography.bodySmall,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  description: {
    ...Typography.body,
    textAlign: "center",
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  paragraph: {
    ...Typography.body,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  featureText: {
    ...Typography.body,
  },
  footer: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  footerText: {
    ...Typography.bodySmall,
  },
  footerVersion: {
    ...Typography.label,
  },
});
