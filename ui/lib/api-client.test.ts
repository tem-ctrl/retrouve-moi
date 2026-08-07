import { describe, expect, it } from 'vitest';
import { apiClient } from './api-client';
import { missingPersonFixtures } from '@/mocks/fixtures';

describe('apiClient (via MSW)', () => {
  it('fetches missing persons from the mocked API', async () => {
    const persons = await apiClient.getMissingPersons({ limit: 30 });
    expect(persons).toEqual(missingPersonFixtures);
  });

  it('returns 404 for an unknown missing person id', async () => {
    await expect(apiClient.getMissingPerson(9999)).rejects.toThrow();
  });
});
