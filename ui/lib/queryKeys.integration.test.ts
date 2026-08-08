import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { useSWRConfig } from 'swr';
import { describe, expect, it } from 'vitest';

import { useLostItems } from '@/hooks/api/useLostItems';
import { useMissingPersons } from '@/hooks/api/useMissingPersons';
import { useMissingPersonsInfinite } from '@/hooks/api/useMissingPersonsInfinite';
import { env } from '@/lib/env';
import { lostItemKeys, missingPersonKeys } from '@/lib/queryKeys';
import { missingPersonFixtures } from '@/mocks/fixtures';
import { server } from '@/mocks/node';
import { SWRTestWrapper } from '@/test/swr-wrapper';

// Proves the two-part mechanism app/page.tsx's handleReportSuccess actually
// relies on (see lib/queryKeys.ts for why it's two parts, not one): a broad
// matcher-based mutate() revalidates every array-keyed regular hook for a
// resource, while a useSWRInfinite hook needs its own returned mutate()
// called directly — a matcher-based mutate never revalidates it, confirmed
// by direct testing, not assumed.
describe('invalidating a resource after a mutation', () => {
  it('revalidates every regular hook instance from one broad matcher-based mutate() call', async () => {
    const { result } = renderHook(
      () => ({
        regular: useMissingPersons(),
        // Bound to whatever cache is active in this render tree (the
        // isolated per-test cache from SWRTestWrapper) — unlike the
        // top-level `import { mutate } from 'swr'`, which always targets
        // SWR's global default cache regardless of a custom provider. Using
        // the wrong one here would silently mutate a cache nothing reads.
        mutate: useSWRConfig().mutate,
      }),
      { wrapper: SWRTestWrapper },
    );

    await waitFor(() => expect(result.current.regular.isLoading).toBe(false));
    expect(result.current.regular.data).toEqual(missingPersonFixtures);

    // Simulate the new report that appears after a submission.
    const updated = [...missingPersonFixtures, { ...missingPersonFixtures[0], id: 999 }];
    server.use(
      http.get(`${env.NEXT_PUBLIC_API_URL}/missing-persons`, () =>
        HttpResponse.json({ data: updated }),
      ),
    );

    await result.current.mutate(missingPersonKeys.matchesAnyKey);

    await waitFor(() => expect(result.current.regular.data).toEqual(updated));
  });

  it('revalidates a useSWRInfinite hook via its own mutate(), independent of the matcher', async () => {
    const { result } = renderHook(() => useMissingPersonsInfinite(), {
      wrapper: SWRTestWrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(missingPersonFixtures);

    const updated = [...missingPersonFixtures, { ...missingPersonFixtures[0], id: 999 }];
    server.use(
      http.get(`${env.NEXT_PUBLIC_API_URL}/missing-persons`, () =>
        HttpResponse.json({ data: updated }),
      ),
    );

    await result.current.mutate();

    await waitFor(() => expect(result.current.data).toEqual(updated));
  });

  it('does not revalidate an unrelated resource', async () => {
    const { result } = renderHook(
      () => ({
        items: useLostItems(),
        mutate: useSWRConfig().mutate,
      }),
      { wrapper: SWRTestWrapper },
    );

    await waitFor(() => expect(result.current.items.isLoading).toBe(false));
    const originalItems = result.current.items.data;

    let lostItemsRequests = 0;
    server.use(
      http.get(`${env.NEXT_PUBLIC_API_URL}/lost-items`, () => {
        lostItemsRequests += 1;
        return HttpResponse.json({ data: originalItems });
      }),
    );

    await result.current.mutate(missingPersonKeys.matchesAnyKey);
    // Give any (incorrect) revalidation a chance to fire before asserting
    // it didn't.
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(lostItemsRequests).toBe(0);
    expect(lostItemKeys.matchesAnyKey(missingPersonKeys.list())).toBe(false);
  });
});
