global.window.matchMedia =
  global.window.matchMedia ||
  ((query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });

vi.mock('electron', async () => {
  return await import('../__mocks__/electron');
});

vi.mock('@electron/remote', async () => {
  return await import('../__mocks__/@electron/remote');
});
