import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import useAccountsStore from '../stores/useAccountsStore';
import useSettingsStore from '../stores/useSettingsStore';

import * as comms from '../utils/comms';
import * as links from '../utils/links';
import { GlobalShortcuts } from './GlobalShortcuts';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('components/GlobalShortcuts.tsx', () => {
  const fetchNotificationsMock = vi.fn();
  const quitAppSpy = vi.spyOn(comms, 'quitApp').mockImplementation(vi.fn());

  beforeEach(() => {
    vi.clearAllMocks();
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
      const openMyNotificationsSpy = vi
        .spyOn(links, 'openMyNotifications')
        .mockImplementation(vi.fn());

      it('opens my notifications when pressing N while logged in', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('n');

        expect(openMyNotificationsSpy).toHaveBeenCalledTimes(1);
      });

      it('does not open my notifications when logged out', async () => {
        useAccountsStore.setState({ accounts: [] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('n');

        expect(openMyNotificationsSpy).not.toHaveBeenCalled();
      });
    });

    describe('toggleReadUnread', () => {
      it('toggles read/unread setting when pressing U while logged in', async () => {
        useSettingsStore.setState({ fetchOnlyUnreadNotifications: false });
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('u');

        expect(updateSettingSpy).toHaveBeenCalledWith(
          'fetchOnlyUnreadNotifications',
          true,
        );
      });

      it('does not toggle read/unread when logged out', async () => {
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('u');

        expect(updateSettingSpy).not.toHaveBeenCalled();
      });

      it('does not toggle read/unread when status is loading', async () => {
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
          {
            status: 'loading',
          },
        );

        await userEvent.keyboard('u');

        expect(updateSettingSpy).not.toHaveBeenCalled();
      });
    });

    describe('groupByProduct', () => {
      it('toggles group by product setting when pressing P while logged in', async () => {
        useSettingsStore.setState({ groupNotificationsByProduct: false });
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('p');

        expect(updateSettingSpy).toHaveBeenCalledWith(
          'groupNotificationsByProduct',
          true,
        );
      });

      it('does not toggle group by product when logged out', async () => {
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('p');

        expect(updateSettingSpy).not.toHaveBeenCalled();
      });
    });

    describe('groupByTitle', () => {
      it('toggles group by title setting when pressing T while logged in', async () => {
        useSettingsStore.setState({ groupNotificationsByTitle: false });
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('t');

        expect(updateSettingSpy).toHaveBeenCalledWith(
          'groupNotificationsByTitle',
          true,
        );
      });

      it('does not toggle group by title when logged out', async () => {
        const updateSettingSpy = vi.spyOn(
          useSettingsStore.getState(),
          'updateSetting',
        );
        useAccountsStore.setState({ accounts: [] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('t');

        expect(updateSettingSpy).not.toHaveBeenCalled();
      });
    });

    describe('filters', () => {
      it('toggles filters when pressing F while logged in', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('f');

        expect(navigateMock).toHaveBeenCalledWith('/filters');
      });

      it('does not toggle filters when logged out', async () => {
        useAccountsStore.setState({ accounts: [] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
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

        expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      });

      it('refreshes notifications from other screen', async () => {
        renderWithAppContext(
          <MemoryRouter initialEntries={['/settings']}>
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
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('s');

        expect(navigateMock).toHaveBeenCalledWith('/settings');
      });

      it('does not toggle settings when logged out', async () => {
        useAccountsStore.setState({ accounts: [] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('s');

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });

    describe('accounts', () => {
      it('navigates to accounts when pressing A on settings route', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter initialEntries={['/settings']}>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('a');

        expect(navigateMock).toHaveBeenCalledWith('/accounts');
      });

      it('does not trigger accounts when not on settings route', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('a');

        expect(navigateMock).not.toHaveBeenCalledWith('/accounts');
      });
    });

    describe('quit app', () => {
      it('quits the app when pressing Q on settings route', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter initialEntries={['/settings']}>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('q');

        expect(quitAppSpy).toHaveBeenCalledTimes(1);
      });

      it('does not quit the app when not on settings route', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        await userEvent.keyboard('q');

        expect(quitAppSpy).not.toHaveBeenCalled();
      });
    });

    describe('modifiers', () => {
      it('ignores shortcuts when typing in an input', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
            <input id="test-input" />
          </MemoryRouter>,
        );

        const input = document.getElementById(
          'test-input',
        ) as HTMLTextAreaElement;
        input.focus();
        await userEvent.type(input, 'h');

        expect(navigateMock).not.toHaveBeenCalled();
      });

      it('ignores shortcuts when typing in a textarea', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
            <textarea id="test-textarea" />
          </MemoryRouter>,
        );

        const textarea = document.getElementById(
          'test-textarea',
        ) as HTMLTextAreaElement;
        textarea.focus();
        await userEvent.type(textarea, 'h');

        expect(navigateMock).not.toHaveBeenCalled();
      });

      it('ignores shortcuts when modifier keys are pressed', async () => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
        renderWithAppContext(
          <MemoryRouter>
            <GlobalShortcuts />
          </MemoryRouter>,
        );

        const event = new KeyboardEvent('keydown', { key: 'h', metaKey: true });
        navigateMock.mockClear();
        document.dispatchEvent(event);

        expect(navigateMock).not.toHaveBeenCalled();
      });
    });
  });
});
