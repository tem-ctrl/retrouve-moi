import { AuthUser } from '@/types';

// Single source of truth for reading/writing the persisted auth session.
// Previously localStorage.getItem/setItem('user'/'authToken') was called
// directly from contexts/AuthContext.tsx (7 call sites) and duplicated in
// lib/http.ts's own private token reader.

const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'authToken';

const isBrowser = () => typeof window !== 'undefined';

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredSession(user: AuthUser, token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredSession(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}
