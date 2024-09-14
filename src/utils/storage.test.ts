import { mockSettings } from '../__mocks__/state-mocks';
import type { Token } from '../types';
import { clearState, loadState, saveState } from './storage';

describe('utils/storage.ts', () => {
  it('should load the state from localstorage - existing', () => {
    jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValueOnce(
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
    jest
      .spyOn(localStorage.__proto__, 'getItem')
      .mockReturnValueOnce(JSON.stringify({}));
    const result = loadState();
    expect(result.auth).toBeUndefined();
    expect(result.auth).toBeUndefined();
    expect(result.settings).toBeUndefined();
  });

  it('should save the state to localstorage', () => {
    jest.spyOn(localStorage.__proto__, 'setItem');
    saveState({
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
      settings: mockSettings,
    });
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should clear the state from localstorage', () => {
    jest.spyOn(localStorage.__proto__, 'clear');
    clearState();
    expect(localStorage.clear).toHaveBeenCalledTimes(1);
  });
});
