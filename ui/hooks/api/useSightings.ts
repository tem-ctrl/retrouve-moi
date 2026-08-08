import useSWR from 'swr';

import { apiFetch } from '@/lib/http';
import { sightingKeys } from '@/lib/queryKeys';
import { API_ROUTES } from '@/lib/routes';
import { Sighting } from '@/types';
import { ApiCollection } from '@/types/api';
import { Filters } from '@/types/api-routes';

// Stable reference so consumers depending on `data` in an effect/memo don't
// see a new array identity on every render while loading.
const EMPTY_SIGHTINGS: Sighting[] = [];

export function useSightings(missingPersonId: number | undefined, filters?: Filters) {
  const { data, error, isLoading, mutate } = useSWR(
    missingPersonId !== undefined ? sightingKeys.list(missingPersonId, filters) : null,
    // TODO: SightingController@index has no JsonResource and currently
    // returns the bare Eloquent collection unwrapped, unlike every other
    // index endpoint (see types/api.ts and apiClient.getSightings' matching
    // TODO). Coded against the correct, consistent ApiCollection<Sighting>
    // shape rather than permanently accommodating that bug — expect this to
    // 404/mismatch against the real backend until SightingController@index
    // is fixed to match.
    () =>
      apiFetch<ApiCollection<Sighting>>(
        // missingPersonId is guaranteed defined here since SWR only calls
        // the fetcher once the key above is non-null.
        API_ROUTES.sightings.list(missingPersonId!, filters),
      ),
  );

  return { data: data?.data ?? EMPTY_SIGHTINGS, error, isLoading, mutate };
}
