import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { Ionicons } from "@expo/vector-icons";

const DAYS_IN_WEEK = 7;
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries } = useEntriesStore();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const entriesByDate = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.entryDate] = (acc[e.entryDate] || 0) + 1;
    return acc;
  }, {});

  const today = now.toISOString().split("T")[0];

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const calendarContent = (
    <>
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((day) => (
          <Text
            key={day}
            style={[styles.weekDay, { color: theme.textSecondary }]}
          >
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dayCell} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEntries = (entriesByDate[dateStr] || 0) > 0;
          const isToday = dateStr === today;

          return (
            <View key={day} style={styles.dayCell}>
              <Pressable
                onPress={() => router.push({ pathname: "/day/[date]", params: { date: dateStr } })}
                style={({ pressed }) => [
                  styles.dayButton,
                  isToday && { backgroundColor: theme.accent + "20" },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isToday ? theme.accent : theme.text,
                      fontWeight: isToday ? "600" : "400",
                    },
                  ]}
                >
                  {day}
                </Text>
                {hasEntries && <View style={[styles.dot, { backgroundColor: theme.accent }]} />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={prevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.heading, { color: theme.text }]}>
          {monthLabel}
        </Text>
        <Pressable onPress={nextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={theme.text} />
        </Pressable>
      </View>

      {Platform.OS === "web" ? (
        <ScrollView style={styles.scrollContainer}>
          {calendarContent}
        </ScrollView>
      ) : (
        calendarContent
      )}
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
    paddingBottom: Spacing.md,
  },
  navButton: {
    padding: Spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
  },
  weekDay: {
    ...Typography.label,
    flex: 1,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.md,
  },
  dayCell: {
    width: `${100 / DAYS_IN_WEEK}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    ...Typography.body,
    fontSize: 16,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 2,
  },
});
