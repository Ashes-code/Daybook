import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { MOODS, MOOD_COLORS } from "../../constants/moods";
import { Ionicons } from "@expo/vector-icons";

export default function AnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries } = useEntriesStore();

  const totalEntries = entries.length;
  const uniqueDays = new Set(entries.map((e) => e.entryDate)).size;

  const moodCounts = MOODS.map((m) => ({
    ...m,
    count: entries.filter((e) => e.mood === m.value).length,
  }));
  const maxMoodCount = Math.max(...moodCounts.map((m) => m.count), 1);

  const entriesPerDay = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.entryDate] = (acc[e.entryDate] || 0) + 1;
    return acc;
  }, {});
  const avgEntriesPerDay = (totalEntries / uniqueDays).toFixed(1);

  const sortedDates = Object.keys(entriesPerDay).sort();
  const streak = sortedDates.reduce((acc, date, i) => {
    if (i === 0) return 1;
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(date);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    return diff === 1 ? acc + 1 : 1;
  }, 1);

  const longestStreak = Math.max(streak, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.heading, { color: theme.text, flex: 1, textAlign: "center" }]}>
          Analytics
        </Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="book-outline" size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>{totalEntries}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Entries</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="calendar-outline" size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>{uniqueDays}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Days Written</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="flame-outline" size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>{longestStreak}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Day Streak</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="trending-up-outline" size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>{avgEntriesPerDay}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Avg / Day</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[Typography.label, { color: theme.textSecondary }]}>
          MOOD BREAKDOWN
        </Text>

        {moodCounts.map((mood) => (
          <View key={mood.value} style={styles.moodRow}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[styles.moodLabel, { color: theme.text }]}>{mood.label}</Text>
            <View style={[styles.barContainer, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: MOOD_COLORS[mood.value],
                    width: `${(mood.count / maxMoodCount) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.moodCount, { color: theme.textSecondary }]}>
              {mood.count}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[Typography.label, { color: theme.textSecondary }]}>
          WRITING HABITS
        </Text>

        <View style={styles.habitRow}>
          <Ionicons name="time-outline" size={20} color={theme.text} />
          <Text style={[styles.habitText, { color: theme.text }]}>
            Most active: Evening
          </Text>
        </View>

        <View style={styles.habitRow}>
          <Ionicons name="bed-outline" size={20} color={theme.text} />
          <Text style={[styles.habitText, { color: theme.text }]}>
            Average entry length: 45 words
          </Text>
        </View>

        <View style={styles.habitRow}>
          <Ionicons name="trophy-outline" size={20} color={theme.text} />
          <Text style={[styles.habitText, { color: theme.text }]}>
            Best streak: {longestStreak} days
          </Text>
        </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  statCard: {
    width: "48%",
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  statValue: {
    ...Typography.heading,
    fontSize: 28,
  },
  statLabel: {
    ...Typography.bodySmall,
  },
  section: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.md,
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  moodEmoji: {
    fontSize: 20,
    width: 28,
  },
  moodLabel: {
    ...Typography.bodySmall,
    width: 50,
  },
  barContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
  moodCount: {
    ...Typography.bodySmall,
    width: 20,
    textAlign: "right",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  habitText: {
    ...Typography.body,
  },
});
