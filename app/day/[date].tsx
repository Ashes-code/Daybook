import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { useAuthStore } from "../../stores/auth";
import { EntryCard } from "../../components/EntryCard";
import { Ionicons } from "@expo/vector-icons";
import { updateEntry as updateEntryService, deleteEntryRemote } from "../../services/entries";
import NetInfo from "@react-native-community/netinfo";

export default function DayEntriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries, deleteEntry, toggleFavorite } = useEntriesStore();
  const { user } = useAuthStore();
  const params = useLocalSearchParams<{ date: string }>();

  const dateStr = params.date ?? new Date().toISOString().split("T")[0];
  const dayEntries = entries.filter((e) => e.entryDate === dateStr);

  const dateLabel = new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleToggleFavorite = async (entry: typeof entries[0]) => {
    toggleFavorite(entry.id);
    const net = await NetInfo.fetch();
    if (net.isConnected && user) {
      const updated = useEntriesStore.getState().entries.find((e) => e.id === entry.id);
      if (updated) await updateEntryService(updated, user.id);
    }
  };

  const handleDelete = async (entry: typeof entries[0]) => {
    deleteEntry(entry.id);
    const net = await NetInfo.fetch();
    if (net.isConnected && user) {
      await deleteEntryRemote(entry.id, user.id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.headingSmall, { color: theme.text, flex: 1, textAlign: "center" }]}>
          {dateLabel}
        </Text>
        <Pressable
          onPress={() =>
            router.push({ pathname: "/entry/new", params: { entryDate: dateStr } })
          }
          style={styles.headerButton}
        >
          <Ionicons name="add" size={24} color={theme.accent} />
        </Pressable>
      </View>

      {dayEntries.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="book-outline" size={48} color={theme.textSecondary} />
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            No entries for this day.
          </Text>
          <Pressable
            onPress={() =>
              router.push({ pathname: "/entry/new", params: { entryDate: dateStr } })
            }
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: theme.accent },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.addButtonText, { color: theme.surface }]}>
              Write something
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={dayEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EntryCard
              entry={item}
              onPress={(entry) =>
                router.push({
                  pathname: "/entry/new",
                  params: {
                    id: entry.id,
                    title: entry.title ?? "",
                    body: entry.body,
                    mood: entry.mood ?? "",
                    entryDate: entry.entryDate,
                  },
                })
              }
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
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
    paddingBottom: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: Spacing.sm,
    minWidth: 60,
    alignItems: "center",
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
  addButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: 8,
  },
  addButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
