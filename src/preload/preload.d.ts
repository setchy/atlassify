import type { AtlassifyAPI } from '.';

declare global {
  interface Window {
    atlassify: AtlassifyAPI;
  }
}
