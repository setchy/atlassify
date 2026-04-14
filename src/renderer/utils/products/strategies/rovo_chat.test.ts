import { defaultStrategy } from './default';
import { rovoChatStrategy } from './rovo_chat';

describe('renderer/utils/products/strategies/rovo_chat', () => {
  it('isRovoActor always returns true', () => {
    expect(rovoChatStrategy.isRovoActor()).toBe(true);
  });

  it('is distinct from defaultStrategy', () => {
    expect(rovoChatStrategy).not.toBe(defaultStrategy);
  });
});
