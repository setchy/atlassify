const { notarize } = require('@electron/notarize');
const { AfterPackContext } = require('electron-builder');

const builderConfig = require('../config/electron-builder');
const appBundleId = builderConfig.appId;

function logNotarizingProgress(msg) {
  // biome-ignore lint/suspicious/noConsoleLog: log notarizing progress
  console.log(`  • 📦 Notarizing Script: ${msg}`);
}

/**
 * @param {AfterPackContext} context
 */
const notarizeApp = async (context) => {
  const { appOutDir } = context;
  const appName = context.packager.appInfo.productFilename;
  const shouldNotarize = process.env.NOTARIZE === 'true';

  if (!shouldNotarize) {
    logNotarizingProgress(
      'skipping notarize step as NOTARIZE env flag was not set',
    );
    return;
  }

  logNotarizingProgress('process started');

  return notarize({
    appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID_USERNAME,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_ID_TEAM_ID,
    tool: 'notarytool',
  });
};

module.exports = notarizeApp;
