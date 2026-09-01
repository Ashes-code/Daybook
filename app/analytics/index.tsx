import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { MOODS, MOOD_COLORS } from "../../constants/moods";
import { Ionicons } from "@expo/vector-icons";

function getUniqueDates(entries: { entryDate: string }[]): string[] {
  return [...new Set(entries.map((e) => e.entryDate))].sort();
}

function computeCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const latest = new Date(sorted[0]);
  latest.setHours(0, 0, 0, 0);

  if (latest.getTime() !== today.getTime() && latest.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeBestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i - 1]);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries } = useEntriesStore();

  const totalEntries = entries.length;
  const allDates = getUniqueDates(entries);
  const uniqueDays = allDates.length;

  const currentStreak = computeCurrentStreak(allDates);
  const bestStreak = computeBestStreak(allDates);

  const weekAgo = getDateDaysAgo(6);
  const weekEntries = entries.filter((e) => e.entryDate >= weekAgo);
  const weekDates = getUniqueDates(weekEntries);
  const weekEntryCount = weekEntries.length;
  const avgEntriesPerDay = weekDates.length > 0
    ? (weekEntryCount / weekDates.length).toFixed(1)
    : "0";

  const weekMoodCounts = MOODS.map((m) => ({
    ...m,
    count: weekEntries.filter((e) => e.mood === m.value).length,
  }));
  const maxWeekMoodCount = Math.max(...weekMoodCounts.map((m) => m.count), 1);

  const hourBuckets: Record<string, number> = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
    Night: 0,
  };
  weekEntries.forEach((e) => {
    const hour = new Date(e.createdAt).getHours();
    if (hour >= 5 && hour < 12) hourBuckets.Morning++;
    else if (hour >= 12 && hour < 17) hourBuckets.Afternoon++;
    else if (hour >= 17 && hour < 21) hourBuckets.Evening++;
    else hourBuckets.Night++;
  });
  const mostActiveTime = Object.entries(hourBuckets).reduce(
    (best, [time, count]) => (count > best[1] ? [time, count] : best),
    ["—", 0]
  )[0];

  const totalWords = weekEntries.reduce((sum, e) => {
    return sum + e.body.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  const avgWordCount = weekEntryCount > 0
    ? Math.round(totalWords / weekEntryCount)
    : 0;

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

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color={theme.textSecondary} />
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            No data yet
          </Text>
          <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: "center" }]}>
            Start writing entries to see your analytics here
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="book-outline" size={24} color={theme.text} />
              <Text style={[styles.statValue, { color: theme.text }]}>{totalEntries}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Entries</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="calendar-outline" size={24} color={theme.text} />
              <Text style={[styles.statValue, { color: theme.text }]}>{uniqueDays}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Days Written</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="flame-outline" size={24} color={theme.text} />
              <Text style={[styles.statValue, { color: theme.text }]}>{currentStreak}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Streak</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="trophy-outline" size={24} color={theme.text} />
              <Text style={[styles.statValue, { color: theme.text }]}>{bestStreak}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Best Streak</Text>
            </View>
          </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[Typography.label, { color: theme.textSecondary }]}>
          MOOD BREAKDOWN (THIS WEEK)
        </Text>

        {weekMoodCounts.map((mood) => (
          <View key={mood.value} style={styles.moodRow}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[styles.moodLabel, { color: theme.text }]}>{mood.label}</Text>
            <View style={[styles.barContainer, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: MOOD_COLORS[mood.value],
                    width: `${(mood.count / maxWeekMoodCount) * 100}%`,
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
          WRITING HABITS (THIS WEEK)
        </Text>

        <View style={styles.habitRow}>
          <Ionicons name="time-outline" size={20} color={theme.text} />
          <Text style={[styles.habitText, { color: theme.text }]}>
            Most active: {mostActiveTime}
          </Text>
        </View>

        <View style={styles.habitRow}>
          <Ionicons name="document-text-outline" size={20} color={theme.text} />
          <Text style={[styles.habitText, { color: theme.text }]}>
            Avg entry length: {avgWordCount} words
          </Text>
        </View>

        <View style={styles.habitRow}>
          <Ionicons name="trending-up-outline" size={20} color={theme.text} />
          <Text style={[styles.habitText, { color: theme.text }]}>
            Avg entries/day: {avgEntriesPerDay}
          </Text>
        </View>
      </View>
        </>
      )}
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
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
