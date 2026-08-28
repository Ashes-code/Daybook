import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Colors, Typography } from "../../constants/theme";

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[Typography.heading, { color: theme.text }]}>
        Calendar
      </Text>
      <Text style={[Typography.body, { color: theme.textSecondary }]}>
        Coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
