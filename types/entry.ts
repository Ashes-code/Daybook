export type Mood = "great" | "good" | "okay" | "low" | "rough";

export type ThemeName = "brownPaper" | "dark" | "light";

export interface Entry {
  id: string;
  userId: string;
  entryDate: string;
  title: string | null;
  body: string;
  mood: Mood | null;
  favorited: boolean;
  createdAt: string;
  updatedAt: string;
}
