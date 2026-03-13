import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useNavigationAnalytics } from './useNavigationAnalytics';

const makeWrapper =
  (path: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  );

describe('renderer/hooks/useNavigationAnalytics.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks "Notifications" for the root route', () => {
    renderHook(() => useNavigationAnalytics(), { wrapper: makeWrapper('/') });

    expect(window.atlassify.aptabase.trackEvent).toHaveBeenCalledWith(
      'Navigate',
      { to: 'Notifications' },
    );
  });

  it('tracks a proper-cased screen name for non-root routes', () => {
    renderHook(() => useNavigationAnalytics(), {
      wrapper: makeWrapper('/settings'),
    });

    expect(window.atlassify.aptabase.trackEvent).toHaveBeenCalledWith(
      'Navigate',
      { to: 'Settings' },
    );
  });
});
