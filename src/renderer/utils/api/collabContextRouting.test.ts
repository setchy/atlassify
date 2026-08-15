import type { CloudID } from '../../types';

import { getCollabContextRoutingAri } from './collabContextRouting';

describe('renderer/utils/api/collabContextRouting.ts', () => {
  it('returns undefined when no cloud ID is provided', () => {
    expect(getCollabContextRoutingAri()).toBeUndefined();
  });

  it('returns the site-scoped routing ARI when a cloud ID is provided', () => {
    const cloudId = 'mock-cloud-id' as CloudID;

    expect(getCollabContextRoutingAri(cloudId)).toBe(
      `ari:cloud:platform::site/${cloudId}`,
    );
  });
});
