import { afterEach, describe, expect, it } from 'vitest';

import {
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  setStoredSession,
} from '@/lib/auth-storage';

afterEach(() => {
  window.localStorage.clear();
});

describe('auth-storage', () => {
  it('returns null for both when nothing is stored', () => {
    expect(getStoredUser()).toBeNull();
    expect(getStoredToken()).toBeNull();
  });

  it('round-trips a user and token through setStoredSession', () => {
    setStoredSession({ id: 1, email: 'jean@example.com' }, 'test-token');

    expect(getStoredUser()).toEqual({ id: 1, email: 'jean@example.com' });
    expect(getStoredToken()).toBe('test-token');
  });

  it('clears both keys via clearStoredSession', () => {
    setStoredSession({ id: 1, email: 'jean@example.com' }, 'test-token');
    clearStoredSession();

    expect(getStoredUser()).toBeNull();
    expect(getStoredToken()).toBeNull();
  });

  it('returns null instead of throwing when the stored user is corrupted JSON', () => {
    window.localStorage.setItem('user', '{not valid json');

    expect(getStoredUser()).toBeNull();
  });
});
