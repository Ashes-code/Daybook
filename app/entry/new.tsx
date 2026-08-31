import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useThemeStore } from "../../stores/theme";
import { useEntriesStore } from "../../stores/entries";
import { useAuthStore } from "../../stores/auth";
import { MOODS, MOOD_COLORS } from "../../constants/moods";
import { Mood } from "../../types/entry";
import { Ionicons } from "@expo/vector-icons";
import { createEntry, updateEntry as updateEntryService } from "../../services/entries";
import NetInfo from "@react-native-community/netinfo";
import * as Haptics from "expo-haptics";

export default function EntryFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const { addEntry, updateEntry } = useEntriesStore();
  const { user } = useAuthStore();

  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    body?: string;
    mood?: Mood;
    entryDate?: string;
  }>();

  const isEditing = !!params.id;

  const [title, setTitle] = useState(params.title ?? "");
  const [body, setBody] = useState(params.body ?? "");
  const [mood, setMood] = useState<Mood | null>((params.mood as Mood) ?? null);
  const [saving, setSaving] = useState(false);
  const bodyRef = useRef<TextInput>(null);

  const wordCount = body.trim() ? body.trim().split(/\s+/).filter(Boolean).length : 0;

  useEffect(() => {
    if (!isEditing) {
      const timer = setTimeout(() => bodyRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!body.trim()) {
      Alert.alert("Empty entry", "Write something before saving.");
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const entryDate = params.entryDate || new Date().toISOString().split("T")[0];

    if (isEditing && params.id) {
      const existingEntry = useEntriesStore.getState().entries.find((e) => e.id === params.id);
      const updated = {
        id: params.id,
        userId: user?.id ?? "",
        entryDate,
        title: title.trim() || null,
        body: body.trim(),
        mood,
        favorited: existingEntry?.favorited ?? false,
        createdAt: existingEntry?.createdAt ?? now,
        updatedAt: now,
      };
      updateEntry(updated);

      const net = await NetInfo.fetch();
      if (net.isConnected && user) {
        const { error } = await updateEntryService(updated, user.id);
        if (error) {
          Alert.alert("Sync failed", "Entry saved locally. It will sync when connection is restored.");
        }
      }
    } else {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const entry = {
        id,
        userId: user?.id ?? "",
        entryDate,
        title: title.trim() || null,
        body: body.trim(),
        mood,
        favorited: false,
        createdAt: now,
        updatedAt: now,
      };
      addEntry(entry);

      const net = await NetInfo.fetch();
      if (net.isConnected && user) {
        const { error } = await createEntry(entry, user.id);
        if (error) {
          Alert.alert("Sync failed", "Entry saved locally. It will sync when connection is restored.");
        }
      }
    }

    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <Text style={[Typography.headingSmall, { color: theme.text }]}>
          {isEditing ? "Edit Entry" : "New Entry"}
        </Text>
        <Pressable onPress={handleSave} disabled={saving} style={styles.headerButton}>
          <Text style={[styles.saveText, { color: theme.accent, opacity: saving ? 0.5 : 1 }]}>
            {saving ? "Saving..." : "Save"}
          </Text>
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
          ref={bodyRef}
          style={[styles.bodyInput, { color: theme.text }]}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.textSecondary}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: "right" }]}>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </Text>

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
                onPress={() => {
                  setMood(isSelected ? null : m.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
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
