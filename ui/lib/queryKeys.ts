import { Filters } from '@/types/api-routes';

/**
 * SWR key factory, one per resource, so cache keys aren't hand-typed
 * strings scattered across hooks. Keys are hierarchical
 * (all -> lists/details -> list(filters)/detail(id)) so a broad `mutate()`
 * can invalidate every query for a resource (e.g. after a report submit)
 * without needing to know every exact filter combination
 * currently cached, while individual hooks still key off the precise,
 * narrow variant they fetched.
 */
function createResourceKeys(resource: string) {
  const all = [resource] as const;
  return {
    all,
    lists: () => [...all, 'list'] as const,
    list: (filters?: Filters) => [...all, 'list', filters ?? {}] as const,
    details: () => [...all, 'detail'] as const,
    detail: (id: number | string) => [...all, 'detail', id] as const,
  };
}

export const missingPersonKeys = createResourceKeys('missing-persons');
export const lostItemKeys = createResourceKeys('lost-items');
export const userKeys = createResourceKeys('users');

/**
 * Sightings don't fit createResourceKeys: every list is scoped to one
 * missing person (see lib/routes.ts's sightings.list), so missingPersonId
 * is part of the key itself — two different missing persons' sightings
 * must never collide in cache.
 */
export const sightingKeys = {
  all: ['sightings'] as const,
  lists: () => [...sightingKeys.all, 'list'] as const,
  list: (missingPersonId: number, filters?: Filters) =>
    [...sightingKeys.lists(), missingPersonId, filters ?? {}] as const,
  details: () => [...sightingKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...sightingKeys.details(), id] as const,
};
