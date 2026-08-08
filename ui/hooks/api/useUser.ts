import useSWR from 'swr';

import { apiFetch } from '@/lib/http';
import { userKeys } from '@/lib/queryKeys';
import { API_ROUTES } from '@/lib/routes';
import { User } from '@/types';
import { ApiResource } from '@/types/api';

export function useUser(id: number | string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    id !== undefined ? userKeys.detail(id) : null,
    // SWR only invokes the fetcher once the key above is non-null, so id is
    // guaranteed defined here — the assertion just works around TS not
    // propagating that narrowing into this closure.
    () => apiFetch<ApiResource<User>>(API_ROUTES.users.byId(id!)),
  );

  return { data: data?.data, error, isLoading, mutate };
}
