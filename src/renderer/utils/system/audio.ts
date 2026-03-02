import type { Percentage } from '../../types';

import { rendererLogError } from '../core';
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

  try {
    await audio.play();
  } catch (err) {
    rendererLogError('audio', 'Failed to play notification sound:', err);
    cachedAudio = null;
  }
}
