import { Mood } from "../types/entry";

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "great", label: "Great", emoji: "😄" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😔" },
  { value: "rough", label: "Rough", emoji: "😞" },
];

export const MOOD_COLORS: Record<Mood, string> = {
  great: "#2ECC71",
  good: "#27AE60",
  okay: "#F39C12",
  low: "#E67E22",
  rough: "#E74C3C",
};
