
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signInWithOtp: (email: string, captchaToken: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshSession = async () => {
    await supabase.auth.refreshSession();
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
  };

  // Modified to work with or without a captcha token
  const signInWithOtp = async (email: string, captchaToken: string) => {
    const redirectTo = `${window.location.origin}`;
    console.log('Sending OTP to:', email);
    
    try {
      // For development purposes, we'll bypass the captcha requirement
      const options = {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo
      };
      
      // Only add captchaToken if it's not our bypass token
      if (captchaToken !== "bypass_captcha_for_development") {
        // @ts-ignore - TypeScript doesn't know about captchaToken
        options.captchaToken = captchaToken;
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
      }
      
      return { error: error || null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut, 
      refreshSession,
      signInWithOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
