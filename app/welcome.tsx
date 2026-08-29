import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeName = colorScheme === "dark" ? "dark" : "brownPaper";
  const theme = Colors[themeName];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
          <Ionicons name="book" size={56} color={theme.accent} />
        </View>

        <Text style={[styles.appName, { color: theme.text }]}>Daybook</Text>

        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Your personal journal, across every device.
        </Text>
      </View>

      <View style={styles.buttonArea}>
        <Pressable
          onPress={() => router.push("/signup")}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={[styles.primaryButtonText, { color: theme.surface }]}>
            Get Started
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/signin")}
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Sign In
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    ...Typography.heading,
    fontSize: 32,
    textAlign: "center",
  },
  tagline: {
    ...Typography.body,
    textAlign: "center",
    maxWidth: 300,
  },
  buttonArea: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    ...Typography.body,
    fontWeight: "600",
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    ...Typography.body,
    fontWeight: "500",
    fontSize: 18,
  },
});