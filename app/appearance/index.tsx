import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { ThemeName } from "../../types/entry";
import { Ionicons } from "@expo/vector-icons";

const THEMES: { name: ThemeName; label: string; description: string }[] = [
  {
    name: "brownPaper",
    label: "Brown Paper",
    description: "Warm, earthy tones like a paper journal",
  },
  {
    name: "dark",
    label: "Dark",
    description: "Clean black and white for night owls",
  },
  {
    name: "light",
    label: "Light",
    description: "Bright and airy with subtle blue accents",
  },
];

export default function AppearanceScreen() {
  const insets = useSafeAreaInsets();
  const { themeName, setTheme } = useThemeStore();
  const currentTheme = Colors[themeName];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={[Typography.heading, { color: currentTheme.text }]}>
          Appearance
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: currentTheme.textSecondary }]}>
        THEME
      </Text>

      <View style={styles.themeList}>
        {THEMES.map((t) => {
          const isActive = themeName === t.name;
          const preview = Colors[t.name];

          return (
            <Pressable
              key={t.name}
              onPress={() => setTheme(t.name)}
              style={({ pressed }) => [
                styles.themeCard,
                {
                  backgroundColor: preview.surface,
                  borderColor: isActive ? currentTheme.accent : preview.border,
                  borderWidth: isActive ? 2 : 1,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.themePreview}>
                <View
                  style={[
                    styles.previewHeader,
                    { backgroundColor: preview.background },
                  ]}
                >
                  <View style={[styles.previewBar, { backgroundColor: preview.accent }]} />
                  <View style={[styles.previewLine, { backgroundColor: preview.textSecondary }]} />
                </View>
                <View style={[styles.previewBody, { backgroundColor: preview.background }]}>
                  <View style={[styles.previewBlock, { backgroundColor: preview.surface }]} />
                  <View style={[styles.previewLine, { backgroundColor: preview.textSecondary, width: "60%" }]} />
                </View>
              </View>

              <View style={styles.themeInfo}>
                <View style={styles.themeNameRow}>
                  <Text style={[styles.themeLabel, { color: currentTheme.text }]}>
                    {t.label}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={20} color={currentTheme.accent} />
                  )}
                </View>
                <Text style={[styles.themeDescription, { color: currentTheme.textSecondary }]}>
                  {t.description}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.label,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  themeList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  themeCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  themePreview: {
    height: 80,
  },
  previewHeader: {
    height: 30,
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  previewBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  previewBody: {
    flex: 1,
    padding: Spacing.sm,
    gap: 4,
  },
  previewBlock: {
    width: 50,
    height: 20,
    borderRadius: 4,
  },
  previewLine: {
    height: 3,
    borderRadius: 2,
    width: "80%",
  },
  themeInfo: {
    padding: Spacing.md,
  },
  themeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  themeLabel: {
    ...Typography.headingSmall,
  },
  themeDescription: {
    ...Typography.bodySmall,
    marginTop: Spacing.xs,
  },
});
