import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";

interface DayHeaderProps {
  date: string;
  entryCount: number;
}

export function DayHeader({ date, entryCount }: DayHeaderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <Text style={[Typography.headingSmall, { color: theme.text }]}>
        {formatted}
      </Text>
      <Text style={[Typography.bodySmall, { color: theme.textSecondary }]}>
        {entryCount} {entryCount === 1 ? "entry" : "entries"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
});
