import userEvent from '@testing-library/user-event';

import { navigateMock, renderWithProviders } from '../__helpers__/test-utils';

import { useSettingsStore } from '../stores';

import * as comms from '../utils/system/comms';
import * as links from '../utils/system/links';
import { GlobalShortcuts } from './GlobalShortcuts';

describe('components/GlobalShortcuts.tsx', () => {
  const fetchNotificationsMock = vi.fn();
  const quitAppSpy = vi.spyOn(comms, 'quitApp').mockImplementation(vi.fn());

  let toggleSettingsSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    toggleSettingsSpy = vi.spyOn(useSettingsStore.getState(), 'toggleSetting');
  });

  describe('key bindings', () => {
    describe('ignores keys that are not valid', () => {
      it('ignores B key', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('b');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('home', () => {
      it('navigates home when pressing H key', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('h');

        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    describe('myNotifications', () => {
      const openMyNotificationsSpy = vi
        .spyOn(links, 'openMyNotifications')
        .mockImplementation(vi.fn());

      it('opens my notifications when pressing N while logged in', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('n');

        expect(openMyNotificationsSpy).toHaveBeenCalledTimes(1);
      });

      it('does not open my notifications when logged out', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          accounts: { accounts: [] },
        });

        await userEvent.keyboard('n');

        expect(openMyNotificationsSpy).not.toHaveBeenCalled();
      });
    });

    describe('toggleReadUnread', () => {
      it('toggles read/unread setting when pressing U while logged in', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          settings: { fetchOnlyUnreadNotifications: false },
        });

        await userEvent.keyboard('u');

        expect(toggleSettingsSpy).toHaveBeenCalledWith(
          'fetchOnlyUnreadNotifications',
        );
      });

      it('does not toggle read/unread when logged out', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          accounts: { accounts: [] },
        });

        await userEvent.keyboard('u');

        expect(toggleSettingsSpy).not.toHaveBeenCalled();
      });

      it('does not toggle read/unread when status is loading', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          isLoading: true,
        });

        await userEvent.keyboard('u');

        expect(toggleSettingsSpy).not.toHaveBeenCalled();
      });
    });

    describe('groupByProduct', () => {
      it('toggles group by product setting when pressing P while logged in', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          settings: { groupNotificationsByProduct: false },
        });

        await userEvent.keyboard('p');

        expect(toggleSettingsSpy).toHaveBeenCalledWith(
          'groupNotificationsByProduct',
        );
      });

      it('does not toggle group by product when logged out', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          accounts: { accounts: [] },
        });

        await userEvent.keyboard('p');

        expect(toggleSettingsSpy).not.toHaveBeenCalled();
      });
    });

    describe('groupByTitle', () => {
      it('toggles group by title setting when pressing T while logged in', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          settings: { groupNotificationsByTitle: false },
        });

        await userEvent.keyboard('t');

        expect(toggleSettingsSpy).toHaveBeenCalledWith(
          'groupNotificationsByTitle',
        );
      });

      it('does not toggle group by title when logged out', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          accounts: { accounts: [] },
        });

        await userEvent.keyboard('t');

        expect(toggleSettingsSpy).not.toHaveBeenCalled();
      });
    });

    describe('filters', () => {
      it('toggles filters when pressing F while logged in', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('f');

        expect(navigateMock).toHaveBeenCalledWith('/filters');
      });

      it('does not toggle filters when logged out', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          accounts: { accounts: [] },
        });

        await userEvent.keyboard('f');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('refresh', () => {
      it('refreshes notifications when pressing R key', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          fetchNotifications: fetchNotificationsMock,
        });

        await userEvent.keyboard('r');

        expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      });

      it('refreshes notifications from other screen', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          initialEntries: ['/settings'],
          fetchNotifications: fetchNotificationsMock,
        });

        await userEvent.keyboard('r');

        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
        expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      });

      it('does not refresh when status is loading', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          isLoading: true,
        });

        await userEvent.keyboard('r');

        expect(fetchNotificationsMock).not.toHaveBeenCalled();
      });
    });

    describe('settings', () => {
      it('toggles settings when pressing S while logged in', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('s');

        expect(navigateMock).toHaveBeenCalledWith('/settings');
      });

      it('does not toggle settings when logged out', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          accounts: { accounts: [] },
        });

        await userEvent.keyboard('s');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('accounts', () => {
      it('navigates to accounts when pressing A on settings route', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          initialEntries: ['/settings'],
        });

        await userEvent.keyboard('a');

        expect(navigateMock).toHaveBeenCalledWith('/accounts');
      });

      it('does not trigger accounts when not on settings route', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('a');

        expect(navigateMock).not.toHaveBeenCalledWith('/accounts');
      });
    });

    describe('quit app', () => {
      it('quits the app when pressing Q on settings route', async () => {
        renderWithProviders(<GlobalShortcuts />, {
          initialEntries: ['/settings'],
        });

        await userEvent.keyboard('q');

        expect(quitAppSpy).toHaveBeenCalledTimes(1);
      });

      it('does not quit the app when not on settings route', async () => {
        renderWithProviders(<GlobalShortcuts />);

        await userEvent.keyboard('q');

        expect(quitAppSpy).not.toHaveBeenCalled();
      });
    });

    describe('modifiers', () => {
      it('ignores shortcuts when typing in an input', async () => {
        renderWithProviders(
          <div>
            <GlobalShortcuts />
            <input id="test-input" />
          </div>,
        );

        const input = document.getElementById(
          'test-input',
        ) as HTMLTextAreaElement;
        input.focus();
        await userEvent.type(input, 'h');

        expect(navigateMock).not.toHaveBeenCalled();
      });

      it('ignores shortcuts when typing in a textarea', async () => {
        renderWithProviders(
          <div>
            <GlobalShortcuts />
            <textarea id="test-textarea" />
          </div>,
        );

        const textarea = document.getElementById(
          'test-textarea',
        ) as HTMLTextAreaElement;
        textarea.focus();
        await userEvent.type(textarea, 'h');

        expect(navigateMock).not.toHaveBeenCalled();
      });

      it('ignores shortcuts when modifier keys are pressed', async () => {
        renderWithProviders(<GlobalShortcuts />);

        const event = new KeyboardEvent('keydown', { key: 'h', metaKey: true });
        navigateMock.mockClear();
        document.dispatchEvent(event);

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });
  });
});
