import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useUser } from '@/hooks/api/useUser';
import { userFixtures } from '@/mocks/fixtures';
import { SWRTestWrapper } from '@/test/swr-wrapper';

describe('useUser', () => {
  it('loads a single user by id', async () => {
    const { result } = renderHook(() => useUser(1), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(userFixtures[0]);
  });

  it('does not fetch when id is undefined', async () => {
    const { result } = renderHook(() => useUser(undefined), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('surfaces an error for an unknown id', async () => {
    const { result } = renderHook(() => useUser(9999), { wrapper: SWRTestWrapper });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.data).toBeUndefined();
  });
});
