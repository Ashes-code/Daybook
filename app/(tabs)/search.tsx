import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { EntryCard } from "../../components/EntryCard";
import { Ionicons } from "@expo/vector-icons";
import { Mood } from "../../types/entry";
import { MOODS, MOOD_COLORS } from "../../constants/moods";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { entries, deleteEntry, toggleFavorite } = useEntriesStore();
  const [query, setQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const results =
    query.length > 0 || selectedMood !== null
      ? entries.filter((e) => {
          const matchesQuery =
            query.length === 0 ||
            e.body.toLowerCase().includes(query.toLowerCase()) ||
            (e.title && e.title.toLowerCase().includes(query.toLowerCase()));
          const matchesMood = selectedMood === null || e.mood === selectedMood;
          return matchesQuery && matchesMood;
        })
      : [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={[Typography.heading, { color: theme.text }]}>
          Search
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Search entries..."
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>

      <View style={styles.moodFilter}>
        <Pressable
          onPress={() => setSelectedMood(null)}
          style={({ pressed }) => [
            styles.moodChip,
            {
              backgroundColor: selectedMood === null ? theme.tabActive + "20" : theme.surface,
              borderColor: selectedMood === null ? theme.tabActive : theme.border,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text
            style={[
              styles.moodChipText,
              { color: selectedMood === null ? theme.tabActive : theme.textSecondary },
            ]}
          >
            All
          </Text>
        </Pressable>

        {MOODS.map((m) => {
          const isSelected = selectedMood === m.value;
          return (
            <Pressable
              key={m.value}
              onPress={() => setSelectedMood(isSelected ? null : m.value)}
              style={({ pressed }) => [
                styles.moodChip,
                {
                  backgroundColor: isSelected
                    ? MOOD_COLORS[m.value] + "20"
                    : theme.surface,
                  borderColor: isSelected ? MOOD_COLORS[m.value] : theme.border,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text
                style={[
                  styles.moodChipText,
                  {
                    color: isSelected
                      ? MOOD_COLORS[m.value]
                      : theme.textSecondary,
                  },
                ]}
              >
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {query.length === 0 && selectedMood === null ? (
        <View style={styles.empty}>
          <Ionicons name="search" size={48} color={theme.textSecondary} />
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            Type to search your entries
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={48} color={theme.textSecondary} />
          <Text style={[Typography.body, { color: theme.textSecondary }]}>
            No results found
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputIcon: {
    position: "absolute",
    left: Spacing.md + 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    ...Typography.body,
    padding: Spacing.sm,
    paddingLeft: Spacing.xl + 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  moodFilter: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  moodChip: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 16,
    borderWidth: 1,
  },
  moodChipText: {
    ...Typography.label,
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
