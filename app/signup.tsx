import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme, Alert, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useState, useRef } from "react";

export default function SignUpScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeName = colorScheme === "dark" ? "dark" : "brownPaper";
  const theme = Colors[themeName];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSignUp = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }
    if (!password) {
      Alert.alert("Missing password", "Please enter a password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match", "Please make sure both passwords are the same.");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }

    Alert.alert("Check your email", "We've sent a confirmation link. Please verify your email to complete sign up.", [
      { text: "OK", onPress: () => router.push("/signin") },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
          <Ionicons name="book" size={48} color={theme.accent} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Start your journaling journey
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <TextInput
          ref={passwordRef}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />

        <TextInput
          ref={confirmPasswordRef}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
        />

        <Pressable
          disabled={loading}
          onPress={handleSignUp}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.8 },
            loading && { opacity: 0.6 },
          ]}
        >
          {loading ? (
            <Text style={[styles.primaryButtonText, { color: theme.surface }]}>Creating account...</Text>
          ) : (
            <Text style={[styles.primaryButtonText, { color: theme.surface }]}>Create Account</Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/signin")}>
            <Text style={[styles.footerLink, { color: theme.accent }]}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    justifyContent: "center",
    gap: Spacing.lg,
  },
  iconCircle: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.heading,
    fontSize: 28,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
  },
  input: {
    ...Typography.body,
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  primaryButtonText: {
    ...Typography.body,
    fontWeight: "600",
    fontSize: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.body,
  },
  footerLink: {
    ...Typography.body,
    fontWeight: "600",
  },
});
