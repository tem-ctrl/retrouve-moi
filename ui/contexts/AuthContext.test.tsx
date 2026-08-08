import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { getStoredToken, getStoredUser, setStoredSession } from '@/lib/auth-storage';
import { env } from '@/lib/env';
import { userFixtures } from '@/mocks/fixtures';
import { server } from '@/mocks/node';
import { SWRTestWrapper } from '@/test/swr-wrapper';

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRTestWrapper>
      <AuthProvider>{children}</AuthProvider>
    </SWRTestWrapper>
  );
}

afterEach(() => {
  window.localStorage.clear();
});

describe('AuthContext', () => {
  it('restores a session from storage on mount and loads the profile reactively', async () => {
    setStoredSession({ id: 1, email: userFixtures[0].email }, 'test-token');

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual({ id: 1, email: userFixtures[0].email });
    expect(result.current.session).toEqual({ token: 'test-token' });

    // The profile isn't restored from storage — it's fetched reactively via
    // useUser(user.id) once `user` is set, not eagerly loaded.
    await waitFor(() => expect(result.current.profile).toEqual(userFixtures[0]));
  });

  it('clears storage instead of restoring when only a token (no user) is present', async () => {
    window.localStorage.setItem('authToken', 'orphaned-token');

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(getStoredToken()).toBeNull();
  });

  it('signIn stores the session and the profile becomes available', async () => {
    server.use(
      http.post(`${env.NEXT_PUBLIC_API_URL}/auth/signin`, () =>
        HttpResponse.json(
          { user: { id: 1, email: userFixtures[0].email }, token: 'fresh-token' },
          { status: 201 },
        ),
      ),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const { error } = await result.current.signIn(userFixtures[0].email, 'password');

    expect(error).toBeNull();
    expect(getStoredUser()).toEqual({ id: 1, email: userFixtures[0].email });
    expect(getStoredToken()).toBe('fresh-token');
    await waitFor(() => expect(result.current.profile).toEqual(userFixtures[0]));
  });

  it('signOut clears the user, session, and profile', async () => {
    setStoredSession({ id: 1, email: userFixtures[0].email }, 'test-token');
    server.use(
      http.post(
        `${env.NEXT_PUBLIC_API_URL}/auth/signout`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.profile).toEqual(userFixtures[0]));

    await result.current.signOut();

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(result.current.session).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it('updateProfile revalidates the profile after a successful update', async () => {
    setStoredSession({ id: 1, email: userFixtures[0].email }, 'test-token');
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.profile).toEqual(userFixtures[0]));

    // updateProfile's mutate() call revalidates by re-fetching GET
    // /users/1 — it doesn't read the PATCH response body directly — so the
    // GET handler (not just PATCH) needs to reflect the update.
    const updated = { ...userFixtures[0], full_name: 'Updated Name' };
    server.use(
      http.patch(`${env.NEXT_PUBLIC_API_URL}/users/1`, () => HttpResponse.json({ data: updated })),
      http.get(`${env.NEXT_PUBLIC_API_URL}/users/1`, () => HttpResponse.json({ data: updated })),
    );

    const { error } = await result.current.updateProfile({ full_name: 'Updated Name' });

    expect(error).toBeNull();
    await waitFor(() => expect(result.current.profile?.full_name).toBe('Updated Name'));
  });
});
