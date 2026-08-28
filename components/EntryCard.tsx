import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { Entry } from "../types/entry";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useThemeStore } from "../stores/theme";
import { MOOD_COLORS } from "../constants/moods";
import { Ionicons } from "@expo/vector-icons";

interface EntryCardProps {
  entry: Entry;
  onPress: (entry: Entry) => void;
  onDelete?: (entry: Entry) => void;
  onToggleFavorite?: (entry: Entry) => void;
}

export function EntryCard({
  entry,
  onPress,
  onDelete,
  onToggleFavorite,
}: EntryCardProps) {
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLongPress = () => {
    setMenuVisible(true);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete?.(entry),
      },
    ]);
  };

  const handleToggleFavorite = () => {
    setMenuVisible(false);
    onToggleFavorite?.(entry);
  };

  return (
    <>
      <Pressable
        onPress={() => onPress(entry)}
        onLongPress={handleLongPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
          pressed && { opacity: 0.7 },
        ]}
      >
        <View style={styles.cardHeader}>
          {entry.title && (
            <Text
              style={[styles.title, { color: theme.text }]}
              numberOfLines={1}
            >
              {entry.title}
            </Text>
          )}
          {entry.favorited && (
            <Ionicons name="heart" size={16} color="#E74C3C" />
          )}
        </View>

        <Text
          style={[styles.body, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {entry.body}
        </Text>

        <View style={styles.footer}>
          {entry.mood && (
            <View
              style={[
                styles.moodBadge,
                {
                  backgroundColor: MOOD_COLORS[entry.mood] + "20",
                  borderColor: MOOD_COLORS[entry.mood] + "40",
                },
              ]}
            >
              <Text
                style={[styles.moodText, { color: MOOD_COLORS[entry.mood] }]}
              >
                {entry.mood}
              </Text>
            </View>
          )}

          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {new Date(entry.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menu,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Pressable
              style={[styles.menuItem, { borderBottomColor: theme.border }]}
              onPress={() => {
                setMenuVisible(false);
                onPress(entry);
              }}
            >
              <Ionicons name="create-outline" size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>
                Edit
              </Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, { borderBottomColor: theme.border }]}
              onPress={handleToggleFavorite}
            >
              <Ionicons
                name={entry.favorited ? "heart" : "heart-outline"}
                size={20}
                color={entry.favorited ? "#E74C3C" : theme.text}
              />
              <Text
                style={[
                  styles.menuText,
                  { color: entry.favorited ? "#E74C3C" : theme.text },
                ]}
              >
                {entry.favorited ? "Unfavorite" : "Favorite"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} />
              <Text style={[styles.menuText, { color: theme.error }]}>
                Delete
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...Typography.headingSmall,
    flex: 1,
  },
  body: {
    ...Typography.bodySmall,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  moodBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
  },
  moodText: {
    ...Typography.label,
    textTransform: "capitalize",
  },
  time: {
    ...Typography.bodySmall,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 180,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuText: {
    ...Typography.body,
  },
});
