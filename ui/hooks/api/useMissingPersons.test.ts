import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMissingPersons } from '@/hooks/api/useMissingPersons';
import { missingPersonFixtures } from '@/mocks/fixtures';
import { SWRTestWrapper } from '@/test/swr-wrapper';

describe('useMissingPersons', () => {
  it('loads the full fixture list', async () => {
    const { result } = renderHook(() => useMissingPersons(), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(missingPersonFixtures);
    expect(result.current.error).toBeUndefined();
  });

  it('does not fetch when filters is explicitly null', () => {
    const { result } = renderHook(() => useMissingPersons(null), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });
});
