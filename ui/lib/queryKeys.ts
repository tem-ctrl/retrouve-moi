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
// Matches every SWR cache entry for a resource that uses the array-shaped
// keys from createResourceKeys (first element equals `resource`) — i.e.
// every regular useX hook, regardless of which filters it was called with.
// Pass to SWR's global `mutate()` for broad invalidation after a mutation.
//
// Deliberately does NOT attempt to match useSWRInfinite-based hooks
// (useXInfinite). Their data-bearing cache entry lives under a
// `$inf$`-prefixed key, and — confirmed by direct testing, not assumed —
// SWR's matcher-function mutate() never successfully revalidates that
// entry regardless of what the matcher matches or what options are passed;
// only a literal-key mutate() against the exact `$inf$...` key works. Since
// each useXInfinite instance's key depends on its own filters, there's no
// way to enumerate "every possible instance" from outside. Callers with an
// infinite hook mounted must use that hook's own returned `mutate()` for
// it — see app/page.tsx's handleReportSuccess for both patterns combined.
const matchesResource =
  (resource: string) =>
  (key: unknown): boolean =>
    Array.isArray(key) && key[0] === resource;

function createResourceKeys(resource: string) {
  const all = [resource] as const;
  return {
    all,
    lists: () => [...all, 'list'] as const,
    list: (filters?: Filters) => [...all, 'list', filters ?? {}] as const,
    details: () => [...all, 'detail'] as const,
    detail: (id: number | string) => [...all, 'detail', id] as const,
    matchesAnyKey: matchesResource(resource),
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
  matchesAnyKey: matchesResource('sightings'),
};
