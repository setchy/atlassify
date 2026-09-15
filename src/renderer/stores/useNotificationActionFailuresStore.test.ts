import { renderHook } from '@testing-library/react';

import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import { Errors } from '../utils/core/errors';
import useNotificationActionFailuresStore, {
  getNotificationFailureKey,
} from './useNotificationActionFailuresStore';

describe('renderer/stores/useNotificationActionFailuresStore.ts', () => {
  beforeEach(() => {
    useNotificationActionFailuresStore.getState().reset();
  });

  it('sets and clears a notification failure', () => {
    const { result } = renderHook(() => useNotificationActionFailuresStore());
    const key = getNotificationFailureKey(mockAtlassianCloudAccount, 'one');

    result.current.setFailure(key, {
      action: 'read',
      error: Errors.UNKNOWN,
    });
    expect(useNotificationActionFailuresStore.getState().failures[key]).toEqual(
      { action: 'read', error: Errors.UNKNOWN },
    );

    useNotificationActionFailuresStore.getState().clearFailure(key);
    expect(useNotificationActionFailuresStore.getState().failures).toEqual({});
  });

  it('prunes missing notifications and clears removed accounts', () => {
    const firstKey = getNotificationFailureKey(
      mockAtlassianCloudAccount,
      'one',
    );
    const secondKey = getNotificationFailureKey(
      mockAtlassianCloudAccount,
      'two',
    );
    const store = useNotificationActionFailuresStore.getState();
    store.setFailure(firstKey, { action: 'read', error: Errors.UNKNOWN });
    store.setFailure(secondKey, { action: 'unread', error: Errors.NETWORK });

    store.pruneFailures([secondKey]);
    expect(useNotificationActionFailuresStore.getState().failures).toEqual({
      [secondKey]: { action: 'unread', error: Errors.NETWORK },
    });

    store.clearAccountFailures(mockAtlassianCloudAccount.id);
    expect(useNotificationActionFailuresStore.getState().failures).toEqual({});
  });
});
