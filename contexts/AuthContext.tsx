"use client";

import { createClient } from "@/lib/client";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { createContext, useContext, useEffect, useState } from "react";
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null);
        } else {
          setUser(session.user);
        }
        setSession(session);
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
