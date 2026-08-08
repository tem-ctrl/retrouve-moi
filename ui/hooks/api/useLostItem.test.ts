import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLostItem } from '@/hooks/api/useLostItem';
import { lostItemFixtures } from '@/mocks/fixtures';
import { SWRTestWrapper } from '@/test/swr-wrapper';

describe('useLostItem', () => {
  it('loads a single item by id', async () => {
    const { result } = renderHook(() => useLostItem(1), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(lostItemFixtures[0]);
  });

  it('does not fetch when id is undefined', async () => {
    const { result } = renderHook(() => useLostItem(undefined), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('surfaces an error for an unknown id', async () => {
    const { result } = renderHook(() => useLostItem(9999), { wrapper: SWRTestWrapper });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.data).toBeUndefined();
  });
});
