import { describe, expect, it } from 'vitest';

import { lostItemKeys, missingPersonKeys, sightingKeys, userKeys } from '@/lib/queryKeys';

describe('missingPersonKeys', () => {
  it('builds list keys scoped under the resource and "list"', () => {
    expect(missingPersonKeys.list()).toEqual(['missing-persons', 'list', {}]);
    expect(missingPersonKeys.list({ region: 'Centre' })).toEqual([
      'missing-persons',
      'list',
      { region: 'Centre' },
    ]);
  });

  it('builds detail keys scoped under the resource and "detail"', () => {
    expect(missingPersonKeys.detail(1)).toEqual(['missing-persons', 'detail', 1]);
  });

  it('keeps `all` as a prefix of every list/detail key, for broad mutate() matching', () => {
    expect(missingPersonKeys.list({ region: 'Centre' }).slice(0, 1)).toEqual(missingPersonKeys.all);
    expect(missingPersonKeys.detail(1).slice(0, 1)).toEqual(missingPersonKeys.all);
  });
});

describe('lostItemKeys and userKeys', () => {
  it('use their own resource namespace', () => {
    expect(lostItemKeys.list()).toEqual(['lost-items', 'list', {}]);
    expect(lostItemKeys.detail(5)).toEqual(['lost-items', 'detail', 5]);
    expect(userKeys.list()).toEqual(['users', 'list', {}]);
    expect(userKeys.detail(5)).toEqual(['users', 'detail', 5]);
  });
});

describe('sightingKeys', () => {
  it('scopes list keys by missingPersonId so different people never collide', () => {
    expect(sightingKeys.list(1)).toEqual(['sightings', 'list', 1, {}]);
    expect(sightingKeys.list(2)).toEqual(['sightings', 'list', 2, {}]);
    expect(sightingKeys.list(1)).not.toEqual(sightingKeys.list(2));
  });

  it('includes extra filters after the missingPersonId', () => {
    expect(sightingKeys.list(1, { limit: 10 })).toEqual(['sightings', 'list', 1, { limit: 10 }]);
  });

  it('builds detail keys independent of any missingPersonId', () => {
    expect(sightingKeys.detail(3)).toEqual(['sightings', 'detail', 3]);
  });
});
