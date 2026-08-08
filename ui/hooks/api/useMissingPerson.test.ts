import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMissingPerson } from '@/hooks/api/useMissingPerson';
import { missingPersonFixtures } from '@/mocks/fixtures';
import { SWRTestWrapper } from '@/test/swr-wrapper';

describe('useMissingPerson', () => {
  it('loads a single person by id', async () => {
    const { result } = renderHook(() => useMissingPerson(1), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(missingPersonFixtures[0]);
  });

  it('does not fetch when id is undefined', async () => {
    const { result } = renderHook(() => useMissingPerson(undefined), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('surfaces an error for an unknown id', async () => {
    const { result } = renderHook(() => useMissingPerson(9999), { wrapper: SWRTestWrapper });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.data).toBeUndefined();
  });
});
