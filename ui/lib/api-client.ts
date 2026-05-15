import { MissingPerson, User, LostItem, Sighting } from "@/types";
import { API_ROUTES } from "@/lib/routes";
import { Filters } from "@/types/api-routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.retrouve-moi.com/api";

export const buildApiEndpoint = (route: string) => `${API_BASE_URL}${route}`;

// Helper to extract data array from API response (handles both wrapped and unwrapped responses)
export const extractDataArray = (response: unknown): unknown[] => {
  // If response is already an array, return it
  if (Array.isArray(response)) {
    return response;
  }
  // If response is an object with a data property that's an array, return that
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as Record<string, unknown>).data;
    if (Array.isArray(data)) {
      return data;
    }
  }
  // If response is an object with a results property that's an array, return that
  if (response && typeof response === 'object' && 'results' in response) {
    const results = (response as Record<string, unknown>).results;
    if (Array.isArray(results)) {
      return results;
    }
  }
  // If response is an object with items property that's an array, return that
  if (response && typeof response === 'object' && 'items' in response) {
    const items = (response as Record<string, unknown>).items;
    if (Array.isArray(items)) {
      return items;
    }
  }
  // Otherwise return empty array as fallback
  return [];
};

// Helper functions for API calls
export const apiClient = {
  // Missing Persons
  async getMissingPersons(filters?: Filters): Promise<MissingPerson[]> {
    const response = await fetch(buildApiEndpoint(API_ROUTES.MISSING_PERSONS.FILTERS(filters)), { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch missing persons');
    const data = await response.json();
    return extractDataArray(data) as MissingPerson[];
  },

  async getMissingPerson(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.MISSING_PERSONS.DETAILS(id)));
    if (!response.ok) throw new Error('Failed to fetch missing person');
    return response.json();
  },

  async createMissingPerson(data: MissingPerson) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.missing_persons), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create missing person');
    return response.json();
  },

  async updateMissingPerson(id: number, data: Partial<MissingPerson>) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.MISSING_PERSONS.DETAILS(id)), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update missing person');
    return response.json();
  },

  async deleteMissingPerson(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.MISSING_PERSONS.DETAILS(id)), { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete missing person');
    return response.json();
  },

  // Lost Items
  async getLostItems(filters?: Filters): Promise<LostItem[]> {
    const response = await fetch(buildApiEndpoint(API_ROUTES.LOST_ITEMS.FILTERS(filters)), { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch lost items');
    const data = await response.json();
    return extractDataArray(data) as LostItem[];
  },

  async getLostItem(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.LOST_ITEMS.DETAILS(id)));
    if (!response.ok) throw new Error('Failed to fetch lost item');
    return response.json();
  },

  async createLostItem(data: LostItem) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.lost_items), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create lost item');
    return response.json();
  },

  async updateLostItem(id: number, data: Partial<LostItem>) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.LOST_ITEMS.DETAILS(id)), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update lost item');
    return response.json();
  },

  async deleteLostItem(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.LOST_ITEMS.DETAILS(id)), { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete lost item');
    return response.json();
  },

  // Sightings
  async getSightings(missingPersonId: number, filters?: Filters): Promise<Sighting[]> {
    const response = await fetch(buildApiEndpoint(API_ROUTES.SIGHTINGS.FILTERS(missingPersonId, filters)));
    if (!response.ok) throw new Error('Failed to fetch sightings');
    const data = await response.json();
    return extractDataArray(data) as Sighting[];
  },

  async createSighting(data: Sighting) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.sightings), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create sighting');
    return response.json();
  },

  // Users
  async getUser(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.USERS.DETAILS(id)));
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getUserByEmail(email: string) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.USERS.BY_EMAIL(email)));
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async createUser(data: User) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.users), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUser(id: number, data: Partial<User>) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.USERS.DETAILS(id)), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(id: number) {
    const response = await fetch(buildApiEndpoint(API_ROUTES.USERS.DETAILS(id)), { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};

export const makeApiCall = async (endpoint: string, method: string = 'GET', body?: Record<string, unknown> | FormData) => {
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
