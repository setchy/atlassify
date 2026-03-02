import type { Percentage } from '../../types';

import { volumePercentageToLevel } from '../ui/volume';

// Cache audio instance to avoid re-creating elements on every notification.
let cachedAudio: HTMLAudioElement | null = null;

export async function raiseSoundNotification(volume: Percentage) {
  if (!cachedAudio) {
    const path = await window.atlassify.notificationSoundPath();

    cachedAudio = new Audio(path);
  }

  const audio = cachedAudio;

  audio.volume = volumePercentageToLevel(volume);
  audio.play();
}
