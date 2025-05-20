
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
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

    // Handle URL hash for magic link authentication
    const handleHashParams = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Clear the hash to prevent issues on page refresh
        window.location.hash = '';
        
        // Get session - Supabase should automatically process the hash params
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error processing authentication:", error);
        } else if (data?.session) {
          console.log("Successfully authenticated via magic link");
          setSession(data.session);
          setUser(data.session.user);
        }
      }
    };

    // Process hash params AND check for existing session
    handleHashParams();
    
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

  const signInWithOtp = async (email: string) => {
    // Get the current origin (protocol + hostname + port)
    const origin = window.location.origin;
    console.log('Using redirect URL:', origin);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: origin
        }
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
