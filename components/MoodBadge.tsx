import { View, Text, StyleSheet } from "react-native";
import { Mood } from "../types/entry";
import { MOOD_COLORS } from "../constants/moods";
import { Typography, Spacing } from "../constants/theme";

interface MoodBadgeProps {
  mood: Mood;
}

export function MoodBadge({ mood }: MoodBadgeProps) {
  const color = MOOD_COLORS[mood];

  return (
    <View style={[styles.badge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.text, { color }]}>{mood}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    ...Typography.label,
    textTransform: "capitalize",
  },
});
