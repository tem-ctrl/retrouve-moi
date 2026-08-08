import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSightings } from '@/hooks/api/useSightings';
import { sightingFixtures } from '@/mocks/fixtures';
import { SWRTestWrapper } from '@/test/swr-wrapper';

describe('useSightings', () => {
  it('loads sightings for a missing person', async () => {
    const { result } = renderHook(() => useSightings(1), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(sightingFixtures);
  });

  it('does not fetch when missingPersonId is undefined', async () => {
    const { result } = renderHook(() => useSightings(undefined), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });
});
