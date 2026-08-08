import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLostItems } from '@/hooks/api/useLostItems';
import { lostItemFixtures } from '@/mocks/fixtures';
import { SWRTestWrapper } from '@/test/swr-wrapper';

describe('useLostItems', () => {
  it('loads the full fixture list', async () => {
    const { result } = renderHook(() => useLostItems(), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(lostItemFixtures);
    expect(result.current.error).toBeUndefined();
  });

  it('does not fetch when filters is explicitly null', () => {
    const { result } = renderHook(() => useLostItems(null), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });
});
