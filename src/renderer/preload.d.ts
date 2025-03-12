import type { AtlassifyAPI } from '../preload/types';

declare global {
  interface Window {
    atlassify: AtlassifyAPI;
  }
}
