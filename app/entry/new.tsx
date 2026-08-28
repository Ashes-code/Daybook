import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { MOODS, MOOD_COLORS } from "../../constants/moods";
import { Mood } from "../../types/entry";
import { Ionicons } from "@expo/vector-icons";

export default function NewEntryScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);

  const handleSave = () => {
    if (!body.trim()) {
      Alert.alert("Empty entry", "Write something before saving.");
      return;
    }

    Alert.alert("Saved!", "Entry saved successfully.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.headingSmall, { color: theme.text }]}>
          New Entry
        </Text>
        <Pressable onPress={handleSave} style={styles.headerButton}>
          <Text style={[styles.saveText, { color: theme.accent }]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={[
            styles.titleInput,
            { color: theme.text, borderBottomColor: theme.border },
          ]}
          placeholder="Title (optional)"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.bodyInput, { color: theme.text }]}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.textSecondary}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        <Text style={[Typography.label, { color: theme.textSecondary, marginTop: Spacing.lg }]}>
          HOW ARE YOU FEELING?
        </Text>

        <View style={styles.moodRow}>
          {MOODS.map((m) => {
            const isSelected = mood === m.value;
            const moodColor = MOOD_COLORS[m.value];
            return (
              <Pressable
                key={m.value}
                onPress={() => setMood(isSelected ? null : m.value)}
                style={({ pressed }) => [
                  styles.moodOption,
                  {
                    backgroundColor: isSelected ? moodColor : theme.surface,
                    borderColor: isSelected ? moodColor : theme.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    { color: isSelected ? "#FFFFFF" : theme.textSecondary },
                  ]}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
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
  },
  saveText: {
    ...Typography.body,
    fontWeight: "600",
    textAlign: "right",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  titleInput: {
    ...Typography.heading,
    borderBottomWidth: 1,
    paddingBottom: Spacing.sm,
  },
  bodyInput: {
    ...Typography.body,
    minHeight: 200,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  moodOption: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 70,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    ...Typography.label,
    marginTop: Spacing.xs,
  },
});
