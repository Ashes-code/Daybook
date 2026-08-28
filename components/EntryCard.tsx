import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Entry } from "../types/entry";
import { Colors, Spacing, Typography } from "../constants/theme";
import { MOOD_COLORS } from "../constants/moods";

interface EntryCardProps {
  entry: Entry;
  onPress: (entry: Entry) => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={() => onPress(entry)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      {entry.title && (
        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={1}
        >
          {entry.title}
        </Text>
      )}

      <Text
        style={[styles.body, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {entry.body}
      </Text>

      <View style={styles.footer}>
        {entry.mood && (
          <View
            style={[
              styles.moodBadge,
              { backgroundColor: MOOD_COLORS[entry.mood] + "20" },
            ]}
          >
            <Text
              style={[styles.moodText, { color: MOOD_COLORS[entry.mood] }]}
            >
              {entry.mood}
            </Text>
          </View>
        )}

        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {new Date(entry.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.headingSmall,
  },
  body: {
    ...Typography.bodySmall,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  moodBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  moodText: {
    ...Typography.label,
    textTransform: "capitalize",
  },
  time: {
    ...Typography.bodySmall,
    fontSize: 12,
  },
});
