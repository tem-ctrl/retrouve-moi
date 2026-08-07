import { http, HttpResponse } from 'msw';

import { buildApiEndpoint } from '@/lib/api-client';

import {
  lostItemFixtures,
  missingPersonFixtures,
  sightingFixtures,
  userFixtures,
} from './fixtures';

const endpoint = (path: string) => buildApiEndpoint(path);

// Mirrors the Laravel JsonResource envelope: single resources as { data: T },
// collections as { data: T[] }. See MissingPersonResource/LostItemResource/UserResource.
export const handlers = [
  http.get(endpoint('/missing-persons'), () => {
    return HttpResponse.json({ data: missingPersonFixtures });
  }),

  http.get(endpoint('/missing-persons/:id'), ({ params }) => {
    const person = missingPersonFixtures.find((p) => String(p.id) === params.id);
    if (!person) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: person });
  }),

  http.get(endpoint('/lost-items'), () => {
    return HttpResponse.json({ data: lostItemFixtures });
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
