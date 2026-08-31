import { View, Text, StyleSheet, Animated, useState, useEffect } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useToastStore } from "../stores/toast";
import { useThemeStore } from "../stores/theme";

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "offline" | "online";
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { themeName } = useThemeStore();
  const theme = Colors[themeName];
  const [opacity] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const getIcon = () => {
    switch (toast.type) {
      case "success": return "checkmark-circle";
      case "error": return "close-circle";
      case "offline": return "wifi-off";
      case "online": return "wifi";
      default: return "information-circle";
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success": return "#2ECC71";
      case "error": return "#E74C3C";
      case "offline": return "#F39C12";
      case "online": return "#3498DB";
      default: return theme.accent;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: getBgColor() },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.toastContent}>
        <Ionicons name={getIcon()} size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={[styles.toastText, { color: "#FFFFFF" }]}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 999,
    flexDirection: "column",
    gap: Spacing.sm,
    pointerEvents: "none",
  },
  toast: {
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  toastText: {
    ...Typography.body,
    flex: 1,
  },
});