import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '../config/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  auth_id: string;
  full_name: string;
  avatar_url: string;
  role: 'jobseeker' | 'employer';
  // Job Seeker Fields
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  title?: string;
  experience?: string;
  summary?: string;
  skills?: { name: string }[];
  education?: { degree: string; institution: string; year: string; field: string; }[];
  // Employer Fields
  company_name?: string;
  company_website?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: (sessionParam?: Session) => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  setProfile: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Supabase to restore the session from localStorage
    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    // Only run after the page is loaded (to ensure localStorage is available)
    if (document.readyState === 'complete') {
      restoreSession();
    } else {
      window.addEventListener('load', restoreSession);
      return () => window.removeEventListener('load', restoreSession);
    }

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);

        // Handle magic link login
        if (event === 'SIGNED_IN') {
          window.location.reload();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for userId:', userId);
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      console.log('fetchProfile result:', { data, error });

      if (!data) {
        // Try to get the Auth user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        const authUser = authData?.user;
        console.log('Auth user:', authUser, 'Auth error:', authError);

        if (authUser) {
          // Try to insert the profile
          console.log('Attempting to insert user profile...');
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || '',
              role: authUser.user_metadata?.role || 'jobseeker',
            }]);
          if (insertError) {
            console.error('Error inserting user profile:', insertError);
          } else {
            // Try to fetch again
            ({ data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single());
            console.log('fetchProfile after insert:', { data, error });
          }
        } else {
          console.error('No auth user found, cannot insert profile.');
        }
      }

      if (data) {
        setProfile({ ...data, auth_id: userId });
        return;
      }
      if (error) {
        console.error('Error fetching user profile:', error);
      }
      setProfile(null);
    } catch (err) {
      console.error('UNHANDLED ERROR in fetchProfile:', err);
    }
  };

  const refreshProfile = async (sessionParam?: Session) => {
    console.log('refreshProfile called with session:', sessionParam);
    let session: Session | undefined = sessionParam;
    if (!session) {
      session = (await supabase.auth.getSession()).data.session || undefined;
    }
    setUser(session?.user ?? null);
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  };

  const value = {
    user,
    setUser,
    profile,
    loading,
    refreshProfile,
    setProfile,
  };

  // Always render children, let components handle loading
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 