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
        [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS],
        {
          loadExtensionOptions: {
            allowFileAccess: true,
          },
          forceDownload: false,
        },
      );

      results.forEach((ext) => {
        logInfo(
          'devtools',
          `Installed extensions ${ext.name} v${ext.version}}`,
        );
      });

      // Verify the extension is loaded
      const extensions = session.defaultSession.extensions.getAllExtensions();
      const installedReactDevTools = extensions.find((ext) =>
        ext.name.includes('React Developer Tools'),
      );
      const installedReduxDevTools = extensions.find((ext) =>
        ext.name.includes('Redux Developer Tools'),
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

      if (installedReduxDevTools) {
        logInfo(
          'devtools',
          `Redux Developer Tools verified: ${installedReactDevTools.name} v${installedReactDevTools.version}`,
        );
      } else {
        logWarn(
          'devtools',
          'Redux Developer Tools not found after installation',
        );
      }
    } catch (error) {
      logWarn(
        'devtools',
        'Failed to install DevTools extensions via installer',
        error,
      );
    } finally {
      installTask = null;
    }
  })();

  await installTask;
}
