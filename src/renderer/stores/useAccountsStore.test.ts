import { act, renderHook } from '@testing-library/react';

import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../__mocks__/account-mocks';

import type { CloudID, Hostname, Username } from '../types';

import * as client from '../utils/api/client';
import { DEFAULT_ACCOUNTS_STATE } from './defaults';
import useAccountsStore from './useAccountsStore';

// Captured before the global test setup overrides `refreshAccount` with a no-op mock.
const realRefreshAccount = useAccountsStore.getState().refreshAccount;

describe('renderer/stores/useAccountsStore.ts', () => {
  beforeEach(() => {
    useAccountsStore.setState({ ...DEFAULT_ACCOUNTS_STATE });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should start with default accounts', () => {
    const { result } = renderHook(() => useAccountsStore());

    expect(result.current).toMatchObject(DEFAULT_ACCOUNTS_STATE);
  });

  describe('removeAccount', () => {
    test('should remove an account', () => {
      useAccountsStore.setState({
        accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
      });

      const { result } = renderHook(() => useAccountsStore());

      act(() => {
        result.current.removeAccount(mockAtlassianCloudAccount);
      });

      expect(result.current.accounts).toHaveLength(1);
      expect(result.current.accounts[0]).toEqual(mockAtlassianCloudAccountTwo);
    });

    test('should not remove account if not found', () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const { result } = renderHook(() => useAccountsStore());

      act(() => {
        result.current.removeAccount(mockAtlassianCloudAccountTwo);
      });

      expect(result.current.accounts).toHaveLength(1);
      expect(result.current.accounts[0]).toEqual(mockAtlassianCloudAccount);
    });
  });

  describe('isLoggedIn', () => {
    test('should return false when no accounts are present', () => {
      const { result } = renderHook(() => useAccountsStore());

      expect(result.current.isLoggedIn()).toBe(false);
    });

    test('should return true when accounts are present', () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const { result } = renderHook(() => useAccountsStore());

      expect(result.current.isLoggedIn()).toBe(true);
    });
  });

  describe('hasMultipleAccounts', () => {
    test('should return false when zero or one account is present', () => {
      const { result } = renderHook(() => useAccountsStore());

      expect(result.current.hasMultipleAccounts()).toBe(false);

      act(() => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
      });

      expect(result.current.hasMultipleAccounts()).toBe(false);
    });

    test('should return true when more than one account is present', () => {
      useAccountsStore.setState({
        accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
      });

      const { result } = renderHook(() => useAccountsStore());

      expect(result.current.hasMultipleAccounts()).toBe(true);
    });
  });

  describe('hasUsernameAlready', () => {
    test('should return true if username already exists (case insensitive)', () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const { result } = renderHook(() => useAccountsStore());

      expect(
        result.current.hasUsernameAlready(mockAtlassianCloudAccount.username),
      ).toBe(true);
    });

    test('should return false if username does not exist', () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const { result } = renderHook(() => useAccountsStore());

      expect(
        result.current.hasUsernameAlready('nonexistentuser' as Username),
      ).toBe(false);
    });
  });

  describe('reset', () => {
    test('should reset accounts to default', () => {
      useAccountsStore.setState({
        accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
      });

      const { result } = renderHook(() => useAccountsStore());

      act(() => {
        result.current.reset();
      });

      expect(result.current).toMatchObject(DEFAULT_ACCOUNTS_STATE);
      expect(result.current.accounts).toEqual([]);
    });
  });

  describe('addHostnameHint', () => {
    test('should add a hostname hint when it resolves to a cloud ID', async () => {
      const mockCloudId = 'cloud-id-123';
      vi.spyOn(client, 'getCloudIDsForHostnames').mockResolvedValueOnce({
        data: {
          tenantContexts: [
            { hostName: 'example.atlassian.net', cloudId: mockCloudId },
          ],
        },
      } as Awaited<ReturnType<typeof client.getCloudIDsForHostnames>>);

      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const { result } = renderHook(() => useAccountsStore());

      let resolved: boolean | undefined;
      await act(async () => {
        resolved = await result.current.addHostnameHint(
          mockAtlassianCloudAccount,
          'example.atlassian.net' as Hostname,
        );
      });

      expect(resolved).toBe(true);
      expect(result.current.accounts[0].hostnameHints).toEqual([
        { hostname: 'example.atlassian.net', cloudId: mockCloudId },
      ]);
    });

    test('should return false and not persist when the hostname does not resolve', async () => {
      vi.spyOn(client, 'getCloudIDsForHostnames').mockResolvedValueOnce({
        data: { tenantContexts: [] },
      } as Awaited<ReturnType<typeof client.getCloudIDsForHostnames>>);

      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const { result } = renderHook(() => useAccountsStore());

      let resolved: boolean | undefined;
      await act(async () => {
        resolved = await result.current.addHostnameHint(
          mockAtlassianCloudAccount,
          'unknown.atlassian.net' as Hostname,
        );
      });

      expect(resolved).toBe(false);
      expect(result.current.accounts[0].hostnameHints).toEqual([]);
    });

    test('should reject a case-insensitive duplicate hostname without calling the API', async () => {
      const getCloudIDsSpy = vi.spyOn(client, 'getCloudIDsForHostnames');

      useAccountsStore.setState({
        accounts: [
          {
            ...mockAtlassianCloudAccount,
            hostnameHints: [
              {
                hostname: 'Example.Atlassian.Net' as Hostname,
                cloudId: 'cloud-id-123' as CloudID,
              },
            ],
          },
        ],
      });

      const { result } = renderHook(() => useAccountsStore());

      let resolved: boolean | undefined;
      await act(async () => {
        resolved = await result.current.addHostnameHint(
          result.current.accounts[0],
          'example.atlassian.net' as Hostname,
        );
      });

      expect(resolved).toBe(false);
      expect(getCloudIDsSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeHostnameHint', () => {
    test('should remove a hostname hint from an account', () => {
      useAccountsStore.setState({
        accounts: [
          {
            ...mockAtlassianCloudAccount,
            hostnameHints: [
              {
                hostname: 'example.atlassian.net' as Hostname,
                cloudId: 'cloud-id-123' as CloudID,
              },
            ],
          },
        ],
      });

      const { result } = renderHook(() => useAccountsStore());

      act(() => {
        result.current.removeHostnameHint(
          result.current.accounts[0],
          'example.atlassian.net' as Hostname,
        );
      });

      expect(result.current.accounts[0].hostnameHints).toEqual([]);
    });
  });

  describe('refreshAccount', () => {
    beforeEach(() => {
      // The global test setup mocks `refreshAccount` as a no-op; restore the real
      // implementation for these tests, which exercise it directly.
      useAccountsStore.setState({ refreshAccount: realRefreshAccount });
    });

    test('should re-resolve existing hostname hints, including hints that stop resolving', async () => {
      vi.spyOn(client, 'getAuthenticatedUser').mockResolvedValueOnce({
        data: {
          me: {
            user: {
              accountId: mockAtlassianCloudAccount.id,
              name: mockAtlassianCloudAccount.name,
              picture: mockAtlassianCloudAccount.avatar,
            },
          },
        },
      } as Awaited<ReturnType<typeof client.getAuthenticatedUser>>);

      const getCloudIDsSpy = vi
        .spyOn(client, 'getCloudIDsForHostnames')
        .mockResolvedValueOnce({
          data: {
            tenantContexts: [
              {
                hostName: 'still-valid.atlassian.net',
                cloudId: 'new-cloud-id',
              },
            ],
          },
        } as Awaited<ReturnType<typeof client.getCloudIDsForHostnames>>);

      const accountWithHints = {
        ...mockAtlassianCloudAccount,
        hostnameHints: [
          {
            hostname: 'still-valid.atlassian.net' as Hostname,
            cloudId: 'old-cloud-id' as CloudID,
          },
          {
            hostname: 'no-longer-valid.atlassian.net' as Hostname,
            cloudId: 'stale-id' as CloudID,
          },
        ],
      };

      useAccountsStore.setState({ accounts: [accountWithHints] });

      const { result } = renderHook(() => useAccountsStore());

      let updated: Awaited<ReturnType<typeof result.current.refreshAccount>>;
      await act(async () => {
        updated = await result.current.refreshAccount(accountWithHints);
      });

      expect(getCloudIDsSpy).toHaveBeenCalledWith(accountWithHints, [
        'still-valid.atlassian.net',
        'no-longer-valid.atlassian.net',
      ]);
      expect(updated.hostnameHints).toEqual([
        { hostname: 'still-valid.atlassian.net', cloudId: 'new-cloud-id' },
        { hostname: 'no-longer-valid.atlassian.net', cloudId: null },
      ]);
    });
  });
});
