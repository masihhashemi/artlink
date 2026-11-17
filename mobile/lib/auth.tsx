import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { Profile } from "@/lib/types";

const TOKEN_KEY = "artlink_token";

type AuthState = {
  token: string | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(TOKEN_KEY);
      if (!saved) {
        setToken(null);
        setProfile(null);
        return;
      }
      const data = await api<{ profile: Profile }>("/me", { token: saved });
      setToken(saved);
      setProfile(data.profile);
    } catch {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const persistSession = useCallback(
    async (nextToken: string, nextProfile: Profile | null) => {
      await AsyncStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);
      setProfile(nextProfile);
    },
    [],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const data = await api<{
        token: string;
        profile: Profile | null;
      }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      await persistSession(data.token, data.profile);
    },
    [persistSession],
  );

  const signUp = useCallback(
    async (fullName: string, email: string, password: string) => {
      const data = await api<{
        token: string;
        profile: Profile | null;
      }>("/auth/signup", {
        method: "POST",
        body: { full_name: fullName, email, password },
      });
      await persistSession(data.token, data.profile);
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const data = await api<{ profile: Profile }>("/me", { token });
    setProfile(data.profile);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [token, profile, loading, signIn, signUp, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
