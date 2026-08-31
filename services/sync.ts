import { supabase } from "../lib/supabase";
import { Entry } from "../types/entry";
import { persistEntriesMiddleware } from "../stores/entries";

interface PendingOperation {
  id: string;
  type: "create" | "update" | "delete";
  entry: Entry;
  timestamp: number;
}

const PENDING_OPS_KEY = "daybook-pending-ops";

export async function syncEntries(userId: string): Promise<void> {
  try {
    const stored = await localStorage.getItem(PENDING_OPS_KEY);
    if (!stored) return;

    const pendingOps: PendingOperation[] = JSON.parse(stored);
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
      } catch (error) {
        console.log("Sync failed for op:", op.type, error);
        remainingOps.push(op);
      }
    }

    if (remainingOps.length > 0) {
      localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(remainingOps));
    } else {
      localStorage.removeItem(PENDING_OPS_KEY);
    }
  } catch (error) {
    console.log("Sync error:", error);
  }
}

export async function queueOperation(type: "create" | "update" | "delete", entry: Entry): Promise<void> {
  try {
    const stored = await localStorage.getItem(PENDING_OPS_KEY);
    const pendingOps: PendingOperation[] = stored ? JSON.parse(stored) : [];

    pendingOps.push({
      id: `${type}-${entry.id}-${Date.now()}`,
      type,
      entry,
      timestamp: Date.now(),
    });

    localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(pendingOps));
  } catch (error) {
    console.log("Failed to queue operation:", error);
  }
}

export async function fetchRemoteEntries(userId: string): Promise<Entry[]> {
  try {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

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
  } catch (error) {
    console.log("Fetch remote entries failed:", error);
    return [];
  }
}

export async function mergeEntries(local: Entry[], remote: Entry[]): Promise<Entry[]> {
  const merged = new Map<string, Entry>();

  for (const entry of local) {
    merged.set(entry.id, entry);
  }

  for (const entry of remote) {
    const existing = merged.get(entry.id);
    if (!existing || new Date(entry.updatedAt) > new Date(existing.updatedAt)) {
      merged.set(entry.id, entry);
    }
  }

  return Array.from(merged.values()).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}