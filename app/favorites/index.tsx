import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { EntryCard } from "../../components/EntryCard";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries, toggleFavorite, deleteEntry } = useEntriesStore();

  const favorites = entries.filter((e) => e.favorited);

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

      {favorites.length === 0 ? (
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
              onDelete={deleteEntry}
              onToggleFavorite={toggleFavorite}
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
