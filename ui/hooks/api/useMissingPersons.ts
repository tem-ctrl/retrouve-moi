import useSWR from 'swr';

import { apiFetch } from '@/lib/http';
import { missingPersonKeys } from '@/lib/queryKeys';
import { API_ROUTES } from '@/lib/routes';
import { MissingPerson } from '@/types';
import { ApiCollection } from '@/types/api';
import { Filters } from '@/types/api-routes';

// Stable reference so consumers depending on `data` in an effect/memo don't
// see a new array identity on every render while loading.
const EMPTY_MISSING_PERSONS: MissingPerson[] = [];

/**
 * Pass `null` (not `undefined`) to skip fetching entirely — e.g. a
 * user-scoped list before the user is known — matching SWR's own
 * null-key-means-skip convention. `undefined`/omitted still means "fetch
 * with no filters."
 */
export function useMissingPersons(filters?: Filters | null) {
  const { data, error, isLoading, mutate } = useSWR(
    filters !== null ? missingPersonKeys.list(filters) : null,
    // SWR only invokes the fetcher once the key above is non-null, so
    // filters is never really null here — the `?? undefined` just satisfies
    // TS since narrowing doesn't propagate into this closure.
    () =>
      apiFetch<ApiCollection<MissingPerson>>(
        API_ROUTES.missingPersons.collection(filters ?? undefined),
      ),
  );

  return { data: data?.data ?? EMPTY_MISSING_PERSONS, error, isLoading, mutate };
}
