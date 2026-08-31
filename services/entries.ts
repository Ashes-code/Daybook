import { supabase } from "../lib/supabase";
import { Entry } from "../types/entry";
import { Platform } from "react-native";

const PENDING_OPS_KEY = "daybook-pending-ops";

interface PendingOperation {
  id: string;
  type: "create" | "update" | "delete";
  entry: Entry;
  timestamp: number;
}

async function readPendingOps(): Promise<PendingOperation[]> {
  if (Platform.OS === "web") {
    const stored = localStorage.getItem(PENDING_OPS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
  const stored = await AsyncStorage.getItem(PENDING_OPS_KEY);
  return stored ? JSON.parse(stored) : [];
}

async function writePendingOps(ops: PendingOperation[]): Promise<void> {
  if (Platform.OS === "web") {
    if (ops.length > 0) {
      localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
    } else {
      localStorage.removeItem(PENDING_OPS_KEY);
    }
    return;
  }
  const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
  if (ops.length > 0) {
    await AsyncStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
  } else {
    await AsyncStorage.removeItem(PENDING_OPS_KEY);
  }
}

export async function createEntry(entry: Entry, userId: string): Promise<{ error?: string }> {
  const { data, error } = await supabase
    .from("entries")
    .insert({
      id: entry.id,
      user_id: userId,
      entry_date: entry.entryDate,
      title: entry.title,
      body: entry.body,
      mood: entry.mood,
      favorited: entry.favorited,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    })
    .select();

  if (error) {
    console.log("[Daybook] createEntry FAILED:", error.message, error.code, error.details);
    await queueOperation("create", entry);
    return { error: error.message };
  }
  console.log("[Daybook] createEntry OK:", data?.length, "row(s)");
  return {};
}

export async function updateEntry(entry: Entry, userId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("entries")
    .update({
      title: entry.title,
      body: entry.body,
      mood: entry.mood,
      favorited: entry.favorited,
      updated_at: entry.updatedAt,
    })
    .eq("id", entry.id)
    .eq("user_id", userId);

  if (error) {
    console.log("[Daybook] updateEntry FAILED:", error.message, error.code);
    await queueOperation("update", entry);
    return { error: error.message };
  }
  return {};
}

export async function deleteEntryRemote(entryId: string, userId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);

  if (error) {
    console.log("[Daybook] deleteEntryRemote FAILED:", error.message, error.code);
    const entry: Entry = {
      id: entryId,
      userId,
      entryDate: "",
      title: null,
      body: "",
      mood: null,
      favorited: false,
      createdAt: "",
      updatedAt: new Date().toISOString(),
    };
    await queueOperation("delete", entry);
    return { error: error.message };
  }
  return {};
}

export async function fetchRemoteEntries(userId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("[Daybook] fetchRemoteEntries FAILED:", error.message, error.code);
    return [];
  }

  console.log("[Daybook] fetchRemoteEntries OK:", data?.length, "row(s)");
  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    entryDate: row.entry_date,
    title: row.title,
    body: row.body,
    mood: row.mood,
    favorited: row.favorited,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function syncPendingOps(userId: string): Promise<void> {
  const pendingOps = await readPendingOps();
  if (pendingOps.length === 0) return;

  const remainingOps: PendingOperation[] = [];

  for (const op of pendingOps) {
    try {
      switch (op.type) {
        case "create": {
          const { error } = await supabase
            .from("entries")
            .insert({
              id: op.entry.id,
              user_id: userId,
              entry_date: op.entry.entryDate,
              title: op.entry.title,
              body: op.entry.body,
              mood: op.entry.mood,
              favorited: op.entry.favorited,
              created_at: op.entry.createdAt,
              updated_at: op.entry.updatedAt,
            });
          if (error) throw error;
          break;
        }
        case "update": {
          const { error } = await supabase
            .from("entries")
            .update({
              title: op.entry.title,
              body: op.entry.body,
              mood: op.entry.mood,
              favorited: op.entry.favorited,
              updated_at: op.entry.updatedAt,
            })
            .eq("id", op.entry.id)
            .eq("user_id", userId);
          if (error) throw error;
          break;
        }
        case "delete": {
          const { error } = await supabase
            .from("entries")
            .delete()
            .eq("id", op.entry.id)
            .eq("user_id", userId);
          if (error) throw error;
          break;
        }
      }
    } catch (err) {
      console.log("Sync failed for op:", op.type, err);
      remainingOps.push(op);
    }
  }

  await writePendingOps(remainingOps);
}

async function queueOperation(type: "create" | "update" | "delete", entry: Entry): Promise<void> {
  const ops = await readPendingOps();
  ops.push({
    id: `${type}-${entry.id}-${Date.now()}`,
    type,
    entry,
    timestamp: Date.now(),
  });
  await writePendingOps(ops);
}
