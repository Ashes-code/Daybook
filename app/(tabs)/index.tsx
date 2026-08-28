import { View, Text, FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { MOCK_ENTRIES } from "../../lib/mock";
import { EntryCard } from "../../components/EntryCard";
import { Ionicons } from "@expo/vector-icons";

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const today = new Date().toISOString().split("T")[0];
  const todayEntries = MOCK_ENTRIES.filter((e) => e.entryDate === today);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View>
          <Text style={[Typography.heading, { color: theme.text }]}>
            Today
          </Text>
          <Text style={[Typography.bodySmall, { color: theme.textSecondary }]}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/entry/new")}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="add" size={24} color={theme.surface} />
        </Pressable>
      </View>

      {todayEntries.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="book-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            No entries today. Start writing!
          </Text>
        </View>
      ) : (
        <FlatList
          data={todayEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EntryCard entry={item} onPress={() => {}} />
          )}
        />
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
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
});
