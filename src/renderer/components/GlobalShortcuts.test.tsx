import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { renderWithAppContext } from '../__helpers__/test-utils';

import * as useLoggedNavigate from '../hooks/useLoggedNavigate';

import * as comms from '../utils/comms';
import * as links from '../utils/links';
import { GlobalShortcuts } from './GlobalShortcuts';

const navigateMock = jest.fn();
jest
  .spyOn(useLoggedNavigate, 'useLoggedNavigate')
  .mockReturnValue(navigateMock);

describe('components/GlobalShortcuts.tsx', () => {
  const fetchNotificationsMock = jest.fn();
  const quitAppSpy = jest.spyOn(comms, 'quitApp').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('key bindings', () => {
    describe('ignores keys that are not valid', () => {
      it('ignores B key', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('b');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('home', () => {
      it('navigates home when pressing H key', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('h');

        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    describe('myNotifications', () => {
      const openMyNotificationsSpy = jest
        .spyOn(links, 'openMyNotifications')
        .mockImplementation();

      it('opens my notifications when pressing N while logged in', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('n');

        expect(openMyNotificationsSpy).toHaveBeenCalledTimes(1);
      });

      it('does not open my notifications when logged out', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: false,
          },
        );

        await userEvent.keyboard('n');

        expect(openMyNotificationsSpy).not.toHaveBeenCalled();
      });
    });

    describe('toggleReadUnread', () => {
      it('toggles read/unread setting when pressing U while logged in', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
            updateSetting: updateSettingMock,
            settings: {
              fetchOnlyUnreadNotifications: false,
            },
          },
        );

        await userEvent.keyboard('u');

        expect(updateSettingMock).toHaveBeenCalledWith(
          'fetchOnlyUnreadNotifications',
          true,
        );
      });

      it('does not toggle read/unread when logged out', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: false,
            updateSetting: updateSettingMock,
          },
        );

        await userEvent.keyboard('u');

        expect(updateSettingMock).not.toHaveBeenCalled();
      });

      it('does not toggle read/unread when status is loading', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
            status: 'loading',
            updateSetting: updateSettingMock,
          },
        );

        await userEvent.keyboard('u');

        expect(updateSettingMock).not.toHaveBeenCalled();
      });
    });

    describe('groupByProduct', () => {
      it('toggles group by product setting when pressing P while logged in', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
            updateSetting: updateSettingMock,
            settings: {
              groupNotificationsByProduct: false,
            },
          },
        );

        await userEvent.keyboard('p');

        expect(updateSettingMock).toHaveBeenCalledWith(
          'groupNotificationsByProduct',
          true,
        );
      });

      it('does not toggle group by product when logged out', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: false,
            updateSetting: updateSettingMock,
          },
        );

        await userEvent.keyboard('p');

        expect(updateSettingMock).not.toHaveBeenCalled();
      });
    });

    describe('groupByTitle', () => {
      it('toggles group by title setting when pressing T while logged in', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
            updateSetting: updateSettingMock,
            settings: {
              groupNotificationsByTitle: false,
            },
          },
        );

        await userEvent.keyboard('t');

        expect(updateSettingMock).toHaveBeenCalledWith(
          'groupNotificationsByTitle',
          true,
        );
      });

      it('does not toggle group by title when logged out', async () => {
        const updateSettingMock = jest.fn();

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: false,
            updateSetting: updateSettingMock,
          },
        );

        await userEvent.keyboard('t');

        expect(updateSettingMock).not.toHaveBeenCalled();
      });
    });

    describe('filters', () => {
      it('toggles filters when pressing F while logged in', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('f');

        expect(navigateMock).toHaveBeenCalledWith('/filters');
      });

      it('does not toggle filters when logged out', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: false,
          },
        );

        await userEvent.keyboard('f');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('refresh', () => {
      it('refreshes notifications when pressing R key', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            fetchNotifications: fetchNotificationsMock,
          },
        );

        await userEvent.keyboard('r');

        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
        expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      });

      it('does not refresh when status is loading', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            status: 'loading',
          },
        );

        await userEvent.keyboard('r');

        expect(fetchNotificationsMock).not.toHaveBeenCalled();
      });
    });

    describe('settings', () => {
      it('toggles settings when pressing S while logged in', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('s');

        expect(navigateMock).toHaveBeenCalledWith('/settings');
      });

      it('does not toggle settings when logged out', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: false,
          },
        );

        await userEvent.keyboard('s');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('accounts', () => {
      it('navigates to accounts when pressing A on settings route', async () => {
        renderWithAppContext(
          <MemoryRouter initialEntries={['/settings']}>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('a');

        expect(navigateMock).toHaveBeenCalledWith('/accounts');
      });

      it('does not trigger accounts when not on settings route', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('a');

        expect(navigateMock).not.toHaveBeenCalledWith('/accounts');
      });
    });

    describe('quit app', () => {
      it('quits the app when pressing Q on settings route', async () => {
        renderWithAppContext(
          <MemoryRouter initialEntries={['/settings']}>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('q');

        expect(quitAppSpy).toHaveBeenCalledTimes(1);
      });

      it('does not quit the app when not on settings route', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        await userEvent.keyboard('q');

        expect(quitAppSpy).not.toHaveBeenCalled();
      });
    });

    describe('modifiers', () => {
      it('ignores shortcuts when typing in an input', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
            <input id="test-input" />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        const input = document.getElementById(
          'test-input',
        ) as HTMLTextAreaElement;
        input.focus();
        await userEvent.type(input, 'h');

        expect(navigateMock).not.toHaveBeenCalled();
      });

      it('ignores shortcuts when typing in a textarea', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
            <textarea id="test-textarea" />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        const textarea = document.getElementById(
          'test-textarea',
        ) as HTMLTextAreaElement;
        textarea.focus();
        await userEvent.type(textarea, 'h');

        expect(navigateMock).not.toHaveBeenCalled();
      });

      it('ignores shortcuts when modifier keys are pressed', async () => {
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            isLoggedIn: true,
          },
        );

        const event = new KeyboardEvent('keydown', { key: 'h', metaKey: true });
        navigateMock.mockClear();
        document.dispatchEvent(event);

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });
  });
});
