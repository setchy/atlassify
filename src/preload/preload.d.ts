import type { AtlassifyAPI } from './types';

declare global {
  interface Window {
    atlassify: AtlassifyAPI;
  }
}
