import { App } from './App';

describe('renderer/App.tsx', () => {
  it('exports the App component and runs module-level store migration', () => {
    // Importing the module executes the legacy store migration at the top level.
    expect(App).toBeDefined();
  });
});
