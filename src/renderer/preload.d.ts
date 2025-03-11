import type { AtlassifyAPI } from '../main/preload';

declare global {
  interface Window {
    atlassify: AtlassifyAPI;
  }
}
