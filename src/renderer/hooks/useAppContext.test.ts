import { renderHook } from '@testing-library/react';

import { useAppContext } from './useAppContext';

describe('renderer/hooks/useAppContext.ts', () => {
  it('throws when used outside AppProvider', () => {
    expect(() => renderHook(() => useAppContext())).toThrow(
      'useAppContext must be used within an AppProvider',
    );
  });
});
