import { useCallback, useState } from "react";
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

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries, loading, toggleFavorite, deleteEntry, setEntries } = useEntriesStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const favorites = entries.filter((e) => e.favorited);

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
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : favorites.length === 0 ? (
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
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
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
  backButton: {
    padding: Spacing.sm,
    minWidth: 40,
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.md,
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
