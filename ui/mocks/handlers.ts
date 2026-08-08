import { http, HttpResponse } from 'msw';

import { buildApiEndpoint } from '@/lib/api-client';
import { LostItem, MissingPerson } from '@/types';

import {
  lostItemFixtures,
  missingPersonFixtures,
  sightingFixtures,
  userFixtures,
} from './fixtures';

const endpoint = (path: string) => buildApiEndpoint(path);

const matchesExact = (searchParams: URLSearchParams, key: string, value: string) => {
  const filterValue = searchParams.get(key);
  return !filterValue || filterValue === value;
};

const matchesSearch = (searchParams: URLSearchParams, ...fields: (string | undefined)[]) => {
  const search = searchParams.get('search');
  if (!search) return true;
  const needle = search.toLowerCase();
  return fields.some((field) => field?.toLowerCase().includes(needle));
};

// Mirrors every index() method's offset()->limit() pagination — applied
// after filtering, matching the real query order.
const paginate = <T>(items: T[], searchParams: URLSearchParams): T[] => {
  const limit = Number(searchParams.get('limit') ?? 15);
  const offset = Number(searchParams.get('offset') ?? 0);
  return items.slice(offset, offset + limit);
};

// Mirrors MissingPersonController@index's filtering, not just its shape —
// region/status/gender/search are real query behavior the UI now relies on
// (see hooks/api/useMissingPersons + app/page.tsx's server-side filters).
const filterMissingPersons = (searchParams: URLSearchParams): MissingPerson[] =>
  missingPersonFixtures.filter(
    (p) =>
      matchesExact(searchParams, 'region', p.region) &&
      matchesExact(searchParams, 'status', p.status) &&
      matchesExact(searchParams, 'gender', p.gender) &&
      matchesSearch(searchParams, p.full_name, p.description, p.last_seen_location),
  );

// Mirrors LostItemController@index's filtering — see filterMissingPersons.
const filterLostItems = (searchParams: URLSearchParams): LostItem[] =>
  lostItemFixtures.filter(
    (i) =>
      matchesExact(searchParams, 'region', i.region) &&
      matchesExact(searchParams, 'status', i.status) &&
      matchesExact(searchParams, 'report_type', i.report_type) &&
      matchesExact(searchParams, 'item_type', i.item_type) &&
      matchesSearch(searchParams, i.item_name, i.description, i.location),
  );

// Mirrors the Laravel JsonResource envelope: single resources as { data: T },
// collections as { data: T[] }. See MissingPersonResource/LostItemResource/UserResource.
export const handlers = [
  http.get(endpoint('/missing-persons'), ({ request }) => {
    const { searchParams } = new URL(request.url);
    return HttpResponse.json({ data: paginate(filterMissingPersons(searchParams), searchParams) });
  }),

  http.get(endpoint('/missing-persons/:id'), ({ params }) => {
    const person = missingPersonFixtures.find((p) => String(p.id) === params.id);
    if (!person) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: person });
  }),

  http.get(endpoint('/lost-items'), ({ request }) => {
    const { searchParams } = new URL(request.url);
    return HttpResponse.json({ data: paginate(filterLostItems(searchParams), searchParams) });
  }),

  http.get(endpoint('/lost-items/:id'), ({ params }) => {
    const item = lostItemFixtures.find((i) => String(i.id) === params.id);
    if (!item) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: item });
  }),

  http.get(endpoint('/sightings'), () => {
    return HttpResponse.json({ data: sightingFixtures });
  }),

  http.post(endpoint('/missing-persons'), () => {
    return HttpResponse.json({ data: { ...missingPersonFixtures[0], id: 999 } }, { status: 201 });
  }),

  http.post(endpoint('/lost-items'), () => {
    return HttpResponse.json({ data: { ...lostItemFixtures[0], id: 999 } }, { status: 201 });
  }),

  http.get(endpoint('/users/:id'), ({ params }) => {
    const user = userFixtures.find((u) => String(u.id) === params.id);
    if (!user) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: user });
  }),
];
