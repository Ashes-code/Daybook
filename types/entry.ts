export type Mood = "great" | "good" | "okay" | "low" | "rough";

export interface Entry {
  id: string;
  userId: string;
  entryDate: string;
  title: string | null;
  body: string;
  mood: Mood | null;
  createdAt: string;
  updatedAt: string;
}
