import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { useLostItemsInfinite } from '@/hooks/api/useLostItemsInfinite';
import { env } from '@/lib/env';
import { lostItemFixtures } from '@/mocks/fixtures';
import { server } from '@/mocks/node';
import { SWRTestWrapper } from '@/test/swr-wrapper';
import { LostItem } from '@/types';

// A 45-record dataset (> one 30-row page) so pagination actually has
// something to page through, independent of the small shared fixtures.
const LARGE_DATASET: LostItem[] = Array.from({ length: 45 }, (_, i) => ({
  ...lostItemFixtures[0],
  id: i + 1,
  item_name: `Item ${i + 1}`,
}));

function mockPaginatedEndpoint() {
  server.use(
    http.get(`${env.NEXT_PUBLIC_API_URL}/lost-items`, ({ request }) => {
      const { searchParams } = new URL(request.url);
      const limit = Number(searchParams.get('limit') ?? 15);
      const offset = Number(searchParams.get('offset') ?? 0);
      return HttpResponse.json({ data: LARGE_DATASET.slice(offset, offset + limit) });
    }),
  );
}

describe('useLostItemsInfinite', () => {
  it('loads the first page and reports more pages are available', async () => {
    mockPaginatedEndpoint();
    const { result } = renderHook(() => useLostItemsInfinite(), { wrapper: SWRTestWrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(30);
    expect(result.current.hasMore).toBe(true);
  });

  it('appends the next page on loadMore and reports no more pages left', async () => {
    mockPaginatedEndpoint();
    const { result } = renderHook(() => useLostItemsInfinite(), { wrapper: SWRTestWrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.loadMore();

    await waitFor(() => expect(result.current.data).toHaveLength(45));
    expect(result.current.hasMore).toBe(false);
  });

  it('does not fetch when filters is explicitly null', () => {
    const { result } = renderHook(() => useLostItemsInfinite(null), { wrapper: SWRTestWrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });
});
