import { env } from '@/lib/env';
import { API_ROUTES } from '@/lib/routes';
import { MissingPerson, User, LostItem, Sighting } from '@/types';
import { ApiCollection } from '@/types/api';
import { Filters } from '@/types/api-routes';

export const buildApiEndpoint = (route: string) => `${env.NEXT_PUBLIC_API_URL}${route}`;

// Helper functions for API calls
export const apiClient = {
  // Missing Persons
  async getMissingPersons(filters?: Filters): Promise<MissingPerson[]> {
    const response = await fetch(buildApiEndpoint(API_ROUTES.missingPersons.collection(filters)), {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch missing persons');
    const body: ApiCollection<MissingPerson> = await response.json();
    return body.data;
  },

  async getMissingPerson(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.missingPersons.byId(id)));
    if (!response.ok) throw new Error('Failed to fetch missing person');
    return response.json();
  },

  async createMissingPerson(data: MissingPerson) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.missingPersons.collection()), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create missing person');
    return response.json();
  },

  async updateMissingPerson(id: number, data: Partial<MissingPerson>) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.missingPersons.byId(id)), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update missing person');
    return response.json();
  },

  async deleteMissingPerson(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.missingPersons.byId(id)), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete missing person');
    return response.json();
  },

  // Lost Items
  async getLostItems(filters?: Filters): Promise<LostItem[]> {
    const response = await fetch(buildApiEndpoint(API_ROUTES.lostItems.collection(filters)), {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch lost items');
    const body: ApiCollection<LostItem> = await response.json();
    return body.data;
  },

  async getLostItem(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.lostItems.byId(id)));
    if (!response.ok) throw new Error('Failed to fetch lost item');
    return response.json();
  },

  async createLostItem(data: LostItem) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.lostItems.collection()), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create lost item');
    return response.json();
  },

  async updateLostItem(id: number, data: Partial<LostItem>) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.lostItems.byId(id)), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update lost item');
    return response.json();
  },

  async deleteLostItem(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.lostItems.byId(id)), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete lost item');
    return response.json();
  },

  // Sightings
  async getSightings(missingPersonId: number, filters?: Filters): Promise<Sighting[]> {
    const response = await fetch(
      buildApiEndpoint(API_ROUTES.sightings.list(missingPersonId, filters)),
    );
    if (!response.ok) throw new Error('Failed to fetch sightings');
    // TODO: SightingController@index currently has no JsonResource and
    // returns the bare Eloquent collection unwrapped, unlike every other
    // index endpoint (see types/api.ts). Update it to wrap the response in
    // { data } like MissingPerson/LostItem/User for this to work correctly.
    const body: ApiCollection<Sighting> = await response.json();
    return body.data;
  },

  async createSighting(data: Sighting) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.sightings.create), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create sighting');
    return response.json();
  },

  // Users
  async getUser(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.users.byId(id)));
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getUserByEmail(email: string) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.users.collection({ email })));
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async createUser(data: User) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.users.collection()), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUser(id: number, data: Partial<User>) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.users.byId(id)), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.users.byId(id)), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};

export const makeApiCall = async (
  endpoint: string,
  method: string = 'GET',
  body?: Record<string, unknown> | FormData,
) => {
  const url = buildApiEndpoint(endpoint);
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Failed to ${method} ${endpoint}`);
  return response.json();
};
