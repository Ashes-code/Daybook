import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme, Alert, Keyboard, TextInputProps, useMemo } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useThemeStore } from "../stores/theme";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useState, useRef, forwardRef } from "react";
import * as WebBrowser from "expo-web-browser";

interface InputWithToggleProps extends TextInputProps {
  showPassword: boolean;
  onToggleShow: () => void;
}

const InputWithToggle = forwardRef<TextInput, InputWithToggleProps>(
  ({ showPassword, onToggleShow, secureTextEntry, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const { themeName } = useThemeStore();
    const effectiveTheme = themeName === "brownPaper" ? (colorScheme === "dark" ? "dark" : "brownPaper") : themeName;
    const theme = Colors[effectiveTheme as "brownPaper" | "dark" | "light"];

    return (
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          {...props}
          secureTextEntry={secureTextEntry && !showPassword}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
              paddingRight: Spacing.xl + Spacing.md,
            },
          ]}
        />
        <Pressable onPress={onToggleShow} style={styles.eyeButton}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
    );
  }
);

InputWithToggle.displayName = "InputWithToggle";

export default function SignInScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { themeName } = useThemeStore();
  const effectiveTheme = themeName === "brownPaper" ? (colorScheme === "dark" ? "dark" : "brownPaper") : themeName;
  const theme = Colors[effectiveTheme as "brownPaper" | "dark" | "light"];

  const styles = useMemo(() => StyleSheet.create({
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
    inputWrapper: {
      position: "relative",
      marginTop: Spacing.sm,
    },
    input: {
      ...Typography.body,
      padding: Spacing.md,
      borderRadius: 10,
      borderWidth: 1,
    },
    eyeButton: {
      position: "absolute",
      right: Spacing.md,
      top: Spacing.md + 4,
      padding: Spacing.xs,
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
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: Spacing.md,
      gap: Spacing.sm,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      ...Typography.label,
      color: theme.textSecondary,
    },
    googleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: Spacing.sm,
      gap: Spacing.sm,
    },
    googleIcon: {
      marginRight: Spacing.xs,
    },
    googleButtonText: {
      ...Typography.body,
      fontWeight: "500",
      fontSize: 16,
    },
  }), [theme]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }
    if (!password) {
      Alert.alert("Missing password", "Please enter your password.");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign in failed", error.message);
      return;
    }

    router.replace("/(tabs)");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "daybook://auth-callback",
        },
      });

      if (error) throw error;

      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, "daybook://auth-callback");
        if (result.type === "success") {
          const { url } = result;
          const { error: sessionError } = await supabase.auth.getSessionFromUrl(url);
          if (sessionError) throw sessionError;
          router.replace("/(tabs)");
        }
      }
    } catch (error: any) {
      Alert.alert("Google sign in failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
          <Ionicons name="book" size={48} color={theme.accent} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sign in to continue your journal
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

        <InputWithToggle
          ref={passwordRef}
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
          showPassword={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
        />

        <Pressable
          disabled={loading}
          onPress={handleSignIn}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.8 },
            loading && { opacity: 0.6 },
          ]}
        >
          {loading ? (
            <Text style={[styles.primaryButtonText, { color: theme.surface }]}>Signing in...</Text>
          ) : (
            <Text style={[styles.primaryButtonText, { color: theme.surface }]}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          disabled={loading}
          onPress={handleGoogleSignIn}
          style={({ pressed }) => [
            styles.googleButton,
            { borderColor: theme.border },
            pressed && { opacity: 0.7 },
            loading && { opacity: 0.6 },
          ]}
        >
          <Ionicons name="logo-google" size={22} color={theme.text} style={styles.googleIcon} />
          <Text style={[styles.googleButtonText, { color: theme.text }]}>Continue with Google</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.push("/signup")}>
            <Text style={[styles.footerLink, { color: theme.accent }]}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}