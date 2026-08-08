import useSWR from 'swr';

import { apiFetch } from '@/lib/http';
import { lostItemKeys } from '@/lib/queryKeys';
import { API_ROUTES } from '@/lib/routes';
import { LostItem } from '@/types';
import { ApiResource } from '@/types/api';

export function useLostItem(id: number | string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    id !== undefined ? lostItemKeys.detail(id) : null,
    // SWR only invokes the fetcher once the key above is non-null, so id is
    // guaranteed defined here — the assertion just works around TS not
    // propagating that narrowing into this closure.
    () => apiFetch<ApiResource<LostItem>>(API_ROUTES.lostItems.byId(id!)),
  );

  return { data: data?.data, error, isLoading, mutate };
}
