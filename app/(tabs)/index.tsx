import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { useAuthStore } from "../../stores/auth";
import { EntryCard } from "../../components/EntryCard";
import { Ionicons } from "@expo/vector-icons";
import { updateEntry as updateEntryService, deleteEntryRemote } from "../../services/entries";
import NetInfo from "@react-native-community/netinfo";

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries, deleteEntry, toggleFavorite } = useEntriesStore();
  const { user } = useAuthStore();

  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.entryDate === today);

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
          <View style={[styles.emptyIcon, { backgroundColor: theme.accent + "15" }]}>
            <Ionicons name="book-outline" size={48} color={theme.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Nothing written yet
          </Text>
          <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
            Today is a blank page. Capture a thought, a moment, anything.
          </Text>
          <Pressable
            onPress={() => router.push("/entry/new")}
            style={({ pressed }) => [
              styles.emptyButton,
              { backgroundColor: theme.accent },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.emptyButtonText, { color: theme.surface }]}>
              Write your first entry
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={todayEntries}
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
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    ...Typography.headingSmall,
    textAlign: "center",
  },
  emptyBody: {
    ...Typography.body,
    textAlign: "center",
    maxWidth: 280,
  },
  emptyButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 10,
    marginTop: Spacing.sm,
  },
  emptyButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
