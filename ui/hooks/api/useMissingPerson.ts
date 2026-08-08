import useSWR from 'swr';

import { apiFetch } from '@/lib/http';
import { missingPersonKeys } from '@/lib/queryKeys';
import { API_ROUTES } from '@/lib/routes';
import { MissingPerson } from '@/types';
import { ApiResource } from '@/types/api';

export function useMissingPerson(id: number | string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    id !== undefined ? missingPersonKeys.detail(id) : null,
    // SWR only invokes the fetcher once the key above is non-null, so id is
    // guaranteed defined here — the assertion just works around TS not
    // propagating that narrowing into this closure.
    () => apiFetch<ApiResource<MissingPerson>>(API_ROUTES.missingPersons.byId(id!)),
  );

  return { data: data?.data, error, isLoading, mutate };
}
