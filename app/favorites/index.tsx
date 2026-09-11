import { useCallback, useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { useAuthStore } from "../../stores/auth";
import { EntryCard } from "../../components/EntryCard";
import { Ionicons } from "@expo/vector-icons";
import { updateEntry as updateEntryService, deleteEntryRemote, fetchRemoteEntries, syncPendingOps } from "../../services/entries";
import NetInfo from "@react-native-community/netinfo";
import { Entry, ThemeName } from "../../types/entry";

type ListItem =
  | { type: "date"; date: string; key: string }
  | { type: "entry"; entry: Entry; key: string };

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function groupByDate(entries: Entry[]): ListItem[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const items: ListItem[] = [];
  let lastDate = "";
  let dateIndex = 0;

  for (const entry of sorted) {
    const date = entry.entryDate;
    if (date !== lastDate) {
      items.push({ type: "date", date, key: `date-${date}-${dateIndex}` });
      lastDate = date;
      dateIndex++;
    }
    items.push({ type: "entry", entry, key: entry.id });
  }

  return items;
}

function DateSeparator({ date, themeName }: { date: string; themeName: ThemeName }) {
  const theme = Colors[themeName];
  return (
    <View style={dateStyles.container}>
      <View style={[dateStyles.line, { backgroundColor: theme.border }]} />
      <View style={[dateStyles.pill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[dateStyles.text, { color: theme.textSecondary }]}>
          {formatDateHeader(date)}
        </Text>
      </View>
      <View style={[dateStyles.line, { backgroundColor: theme.border }]} />
    </View>
  );
}

const dateStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  pill: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    ...Typography.label,
    fontSize: 11,
  },
});

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries, loading, toggleFavorite, deleteEntry, setEntries } = useEntriesStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const listData = useMemo(() => {
    const favorites = entries.filter((e) => e.favorited);
    return groupByDate(favorites);
  }, [entries]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    const net = await NetInfo.fetch();
    if (net.isConnected) {
      await syncPendingOps(user.id);
      const remote = await fetchRemoteEntries(user.id);
      if (remote.length > 0) setEntries(remote);
    }
    setRefreshing(false);
  }, [user, setEntries]);

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
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.heading, { color: theme.text, flex: 1, textAlign: "center" }]}>
          Favorites
        </Text>
        <View style={styles.backButton} />
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={theme.spinner} />
        </View>
      ) : listData.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color={theme.textSecondary} />
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            No favorite entries yet.
          </Text>
          <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: "center" }]}>
            Long-press an entry and tap the heart icon to add it to your favorites.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
          decelerationRate="fast"
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accentLight]}
            />
          }
          renderItem={({ item }) =>
            item.type === "date" ? (
              <DateSeparator date={item.date} themeName={themeName} />
            ) : (
              <EntryCard
                entry={item.entry}
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
            )
          }
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
  backButton: {
    padding: Spacing.sm,
    minWidth: 40,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
});
