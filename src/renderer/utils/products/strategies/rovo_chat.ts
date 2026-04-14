import { DefaultStrategy } from './default';

class RovoChatStrategy extends DefaultStrategy {
  override isRovoActor(): boolean {
    return true;
  }
}

export const rovoChatStrategy = new RovoChatStrategy();
