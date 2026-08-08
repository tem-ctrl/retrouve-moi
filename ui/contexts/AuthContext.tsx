'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { buildApiEndpoint } from '@/lib/api-client';
import {
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  setStoredSession,
} from '@/lib/auth-storage';
import { API_ROUTES } from '@/lib/routes';
import { User } from '@/types';

interface AuthUser {
  id: number;
  email: string;
}

interface AuthSession {
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    passwordConfirmation: string,
    full_name: string,
    phone?: string,
    avatar?: File,
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (user_id: number) => {
    try {
      const response = await fetch(buildApiEndpoint(API_ROUTES.users.byId(user_id)));
      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setSession({ token: storedToken });
      fetchProfile(storedUser.id);
    } else {
      // Covers both "nothing stored" and "corrupted/partial state" (e.g. a
      // token with no matching user) — leaves storage coherent either way.
      clearStoredSession();
    }

    setLoading(false);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    passwordConfirmation: string,
    full_name: string,
    phone?: string,
    avatar?: File,
  ) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
      formData.append('full_name', full_name);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      if (phone) {
        formData.append('phone', phone);
      }

      const response = await fetch(buildApiEndpoint(API_ROUTES.auth.signup), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign up failed');
      }

      const data = await response.json();

      setStoredSession(data.user, data.token);

      setUser(data.user);
      setSession({ token: data.token });

      if (data.user.id) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(buildApiEndpoint(API_ROUTES.auth.signin), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign in failed');
      }

      const data = await response.json();

      setStoredSession(data.user, data.token);

      setUser(data.user);
      setSession({ token: data.token });

      if (data.user.id) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signInWithPhone = async (_phone: string) => {
    // This would require a proper SMS/OTP implementation
    return { error: new Error('Phone sign in not yet implemented') };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const verifyOtp = async (_phone: string, _token: string) => {
    // This would require a proper SMS/OTP implementation
    return { error: new Error('OTP verification not yet implemented') };
  };

  const signOut = async () => {
    try {
      await fetch(buildApiEndpoint(API_ROUTES.auth.signout), { method: 'POST' });
    } catch (error) {
      console.error('Error during sign out:', error);
    }

    clearStoredSession();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const response = await fetch(buildApiEndpoint(API_ROUTES.users.byId(user.id)), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithPhone,
        verifyOtp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
