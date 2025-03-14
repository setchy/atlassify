import { mockSettings } from '../__mocks__/state-mocks';
import { type Link, OpenPreference } from '../types';
import { openExternalLink } from './comms';
import * as storage from './storage';

describe('renderer/utils/comms.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('openExternalLink', () => {
    it('should open an external link', () => {
      jest.spyOn(storage, 'loadState').mockReturnValue({
        settings: { ...mockSettings, openLinks: OpenPreference.BACKGROUND },
      });

      openExternalLink('https://www.atlassify.io/' as Link);

      expect(window.atlassify.openExternalLink).toHaveBeenCalledTimes(1);
      expect(window.atlassify.openExternalLink).toHaveBeenCalledWith(
        'https://www.atlassify.io/',
        false,
      );
    });

    it('should use default open preference if user settings not found', () => {
      jest.spyOn(storage, 'loadState').mockReturnValue({ settings: null });

      openExternalLink('https://www.atlassify.io/' as Link);

      expect(window.atlassify.openExternalLink).toHaveBeenCalledTimes(1);
      expect(window.atlassify.openExternalLink).toHaveBeenCalledWith(
        'https://www.atlassify.io/',
        true,
      );
    });

    it('should ignore opening external local links file:///', () => {
      openExternalLink('file:///Applications/SomeApp.app' as Link);

      expect(window.atlassify.openExternalLink).toHaveBeenCalledTimes(0);
    });
  });
});
