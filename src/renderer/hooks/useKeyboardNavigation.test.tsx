import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useKeyboardNavigation } from './useKeyboardNavigation';

type MockNotification = {
  id: string;
  readState?: 'read' | 'unread';
};

function TestHost({
  notifications,
  onDetailsClick,
}: {
  notifications: MockNotification[];
  onDetailsClick?: (id: string) => void;
}) {
  // adapt to hook expected shape: AccountNotifications[]
  const accountNotifications = [{ notifications }] as any;

  const { focusedNotificationId } = useKeyboardNavigation({
    notifications: accountNotifications,
  });

  return (
    <div>
      <div data-testid="focused">{focusedNotificationId ?? ''}</div>

      {notifications.map((n) => (
        <div
          data-notification-id={n.id}
          data-notification-row="true"
          key={n.id}
          style={{ height: 10 }}
        >
          <button
            data-testid="notification-details"
            onClick={() => onDetailsClick?.(n.id)}
            type="button"
          >
            Details
          </button>

          {n.readState === 'unread' ? (
            <button data-testid="notification-mark-as-read" type="button">
              mark as read
            </button>
          ) : (
            <button data-testid="notification-mark-as-unread" type="button">
              mark as unread
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

describe('useKeyboardNavigation', () => {
  let originalRaf: typeof globalThis.requestAnimationFrame;

  beforeEach(() => {
    originalRaf = globalThis.requestAnimationFrame;
    // run rAF callbacks synchronously in tests
    // @ts-expect-error
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0);
      return 0 as unknown as number;
    };
  });

  afterEach(() => {
    cleanup();
    // restore rAF
    // @ts-expect-error
    globalThis.requestAnimationFrame = originalRaf;
    vi.restoreAllMocks();
  });

  it('navigates notifications with ArrowDown and ArrowUp', async () => {
    const notifications: MockNotification[] = [
      { id: 'n1', readState: 'unread' },
      { id: 'n2', readState: 'read' },
      { id: 'n3', readState: 'unread' },
    ];

    render(<TestHost notifications={notifications} />);

    // initial: no focus
    expect(screen.getByTestId('focused').textContent).toBe('');

    // ArrowDown -> first notification
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(screen.getByTestId('focused').textContent).toBe('n1'),
    );

    // ArrowDown -> second
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(screen.getByTestId('focused').textContent).toBe('n2'),
    );

    // ArrowUp -> back to first
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    await waitFor(() =>
      expect(screen.getByTestId('focused').textContent).toBe('n1'),
    );
  });

  it('opens the focused notification with Enter', async () => {
    const detailsSpy = vi.fn();
    const notifications: MockNotification[] = [
      { id: 'n1', readState: 'unread' },
      { id: 'n2', readState: 'read' },
      { id: 'n3', readState: 'unread' },
    ];

    render(
      <TestHost notifications={notifications} onDetailsClick={detailsSpy} />,
    );

    // Move focus to first notification (n1)
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(screen.getByTestId('focused').textContent).toBe('n1'),
    );

    // Move focus to second
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(screen.getByTestId('focused').textContent).toBe('n2'),
    );

    // Press Enter to open
    fireEvent.keyDown(document, { key: 'Enter' });

    await waitFor(() => expect(detailsSpy).toHaveBeenCalledTimes(1));
    expect(detailsSpy).toHaveBeenCalledWith('n2');
  });
});
