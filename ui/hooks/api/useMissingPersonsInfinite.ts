import useSWRInfinite from 'swr/infinite';

import { apiFetch } from '@/lib/http';
import { API_ROUTES } from '@/lib/routes';
import { MissingPerson } from '@/types';
import { ApiCollection } from '@/types/api';
import { Filters } from '@/types/api-routes';

const PAGE_SIZE = 30;
const EMPTY_MISSING_PERSONS: MissingPerson[] = [];

/**
 * Page-based (limit/offset) infinite loading over GET /missing-persons, for
 * the browsable listing grid specifically — see hooks/api/useMissingPersons
 * for the bounded, non-paginated fetch used by stats/map/etc.
 *
 * Pass `null` to skip fetching entirely, same convention as useMissingPersons.
 */
export function useMissingPersonsInfinite(filters?: Filters | null) {
  const { data, error, size, setSize, isLoading, mutate } = useSWRInfinite<
    ApiCollection<MissingPerson>
  >(
    (pageIndex, previousPageData) => {
      if (filters === null) return null;
      if (previousPageData && previousPageData.data.length < PAGE_SIZE) return null;
      return API_ROUTES.missingPersons.collection({
        ...filters,
        limit: PAGE_SIZE,
        offset: pageIndex * PAGE_SIZE,
      });
    },
    (url: string) => apiFetch<ApiCollection<MissingPerson>>(url),
  );

  const isLoadingMore = isLoading || (size > 0 && !!data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.data.length === 0;
  const hasMore = !isEmpty && !!data && data[data.length - 1]?.data.length === PAGE_SIZE;

  return {
    data: data ? data.flatMap((page) => page.data) : EMPTY_MISSING_PERSONS,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}
