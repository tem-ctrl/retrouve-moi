import { describe, expect, it } from 'vitest';

import { lostItemFixtures, missingPersonFixtures, sightingFixtures } from '@/mocks/fixtures';

import { apiClient } from './api-client';

describe('apiClient (via MSW)', () => {
  it('fetches missing persons from the mocked API', async () => {
    const persons = await apiClient.getMissingPersons({ limit: 30 });
    expect(persons).toEqual(missingPersonFixtures);
  });

  it('returns 404 for an unknown missing person id', async () => {
    await expect(apiClient.getMissingPerson(9999)).rejects.toThrow();
  });

  it('fetches lost items from the mocked API', async () => {
    const items = await apiClient.getLostItems({ limit: 30 });
    expect(items).toEqual(lostItemFixtures);
  });

  it('fetches sightings from the mocked API', async () => {
    const sightings = await apiClient.getSightings(1);
    expect(sightings).toEqual(sightingFixtures);
  });
});
