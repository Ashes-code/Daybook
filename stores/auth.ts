import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setMounted: (mounted: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setMounted: (mounted) => set({ mounted }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

export async function initializeAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const { mounted } = useAuthStore.getState();
    if (!mounted) return;
    
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setUser(session?.user ?? null);
    useAuthStore.getState().setLoading(false);
    useAuthStore.getState().setInitialized(true);
  });

  if (session) {
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setUser(session.user);
  }
  
  useAuthStore.getState().setLoading(false);
  useAuthStore.getState().setInitialized(true);

  return data.subscription;
}