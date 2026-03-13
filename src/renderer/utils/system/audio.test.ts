import { vi } from 'vitest';

import type { Percentage } from '../../types';

import { raiseSoundNotification } from './audio';

describe('renderer/utils/system/audio.ts', () => {
  describe('raiseSoundNotification', () => {
    it('should play sound at correct volume', async () => {
      const audioPlaySpy = vi.spyOn(Audio.prototype, 'play');

      await raiseSoundNotification(50 as Percentage);

      expect(window.atlassify.notificationSoundPath).toHaveBeenCalled();
      expect(audioPlaySpy).toHaveBeenCalled();
    });
  });
});
