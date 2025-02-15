import { mockSettings } from '../__mocks__/state';
import type { Token, Username } from '../types';
import { clearState, loadState, saveState } from './storage';

describe('renderer/utils/storage.ts', () => {
  it('should load the state from localstorage - existing', () => {
    vi.spyOn(localStorage.__proto__, 'getItem').mockReturnValueOnce(
      JSON.stringify({
        auth: {
          accounts: [
            {
              platform: 'Atlassian Cloud',
              method: 'API Token',
              token: '123-456' as Token,
              user: null,
            },
          ],
        },
        settings: { theme: 'DARK' },
      }),
    );
    const result = loadState();

    expect(result.auth.accounts).toEqual([
      {
        platform: 'Atlassian Cloud',
        method: 'API Token',
        token: '123-456' as Token,
        user: null,
      },
    ]);
    expect(result.settings.theme).toBe('DARK');
  });

  it('should load the state from localstorage - empty', () => {
    vi.spyOn(localStorage.__proto__, 'getItem').mockReturnValueOnce(
      JSON.stringify({}),
    );
    const result = loadState();
    expect(result.auth).toBeUndefined();
    expect(result.auth).toBeUndefined();
    expect(result.settings).toBeUndefined();
  });

  it('should save the state to localstorage', () => {
    vi.spyOn(localStorage.__proto__, 'setItem');
    saveState({
      auth: {
        accounts: [
          {
            id: '123',
            username: 'user@atlassify.io' as Username,
            token: '123-456' as Token,
            name: 'Atlassify',
            avatar: null,
          },
        ],
      },
      settings: mockSettings,
    });
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should clear the state from localstorage', () => {
    vi.spyOn(localStorage.__proto__, 'clear');
    clearState();
    expect(localStorage.clear).toHaveBeenCalledTimes(1);
  });
});
