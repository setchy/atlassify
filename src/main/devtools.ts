import { session } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';

import { logInfo, logWarn } from '../shared/logger';

import { isDevMode } from './utils';

let installTask: Promise<void> | null = null;

export async function installReactDevtools() {
  if (!isDevMode) {
    return;
  }

  if (installTask) {
    await installTask;
    return;
  }

  installTask = (async () => {
    try {
      const results = await installExtension(
        [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS],
        {
          loadExtensionOptions: {
            allowFileAccess: true,
          },
          forceDownload: false,
        },
      );

      results.forEach((ext) => {
        logInfo('devtools', `Installed ${ext.name} v${ext.version}`);
      });

      // Verify the extension is loaded
      const extensions = session.defaultSession.extensions.getAllExtensions();

      const installedReactDevTools = extensions.find((ext) =>
        ext.name.includes('React Developer Tools'),
      );
      if (installedReactDevTools) {
        logInfo(
          'devtools',
          `React Developer Tools verified: ${installedReactDevTools.name} v${installedReactDevTools.version}`,
        );
      } else {
        logWarn(
          'devtools',
          'React Developer Tools not found after installation',
        );
      }

      const installedReduxtDevTools = extensions.find((ext) =>
        ext.name.includes('Redux DevTools'),
      );
      if (installedReduxtDevTools) {
        logInfo(
          'devtools',
          `Redux DevTools verified: ${installedReduxtDevTools.name} v${installedReduxtDevTools.version}`,
        );
      } else {
        logWarn('devtools', 'Redux DevTools not found after installation');
      }
    } catch (error) {
      logWarn(
        'devtools',
        'Failed to install Developer Tools extensions via installer',
        error,
      );
    } finally {
      installTask = null;
    }
  })();

  await installTask;
}
