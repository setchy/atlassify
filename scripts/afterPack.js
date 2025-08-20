const path = require('node:path');
const fs = require('node:fs');

const builderConfig = require('../config/electron-builder');
const electronLanguages = builderConfig.electronLanguages;

function logAfterPackProgress(msg) {
  // biome-ignore lint/suspicious/noConsole: log notarizing progress
  console.log(`  • [afterPack]: ${msg}`);
}

const { execSync } = require('node:child_process');

const afterPack = async (context) => {
  logAfterPackProgress('Starting...');

  const appName = context.packager.appInfo.productFilename;
  const appOutDir = context.appOutDir;
  const platform = context.electronPlatformName;

  if (platform === 'darwin') {
    removeUnusedLocales(appOutDir, appName);

    // Optional deep signing diagnostics when DEBUG_SIGNING env var is set.
    if (process.env.DEBUG_SIGNING === 'true') {
      try {
        logAfterPackProgress(
          'DEBUG_SIGNING: listing available code signing identities',
        );
        const identities = execSync(
          'security find-identity -v -p codesigning || true',
          {
            stdio: 'pipe',
          },
        )
          .toString()
          .trim()
          .split('\n')
          .filter(Boolean);
        if (!identities.length) {
          logAfterPackProgress('  (no identities output)');
        } else {
          identities.forEach((line) => {
            logAfterPackProgress(`identity: ${line}`);
          });
        }

        const appPath = path.join(appOutDir, `${appName}.app`);
        logAfterPackProgress(
          'DEBUG_SIGNING: displaying primary app signature metadata',
        );
        safeExec(
          `codesign -dv --verbose=4 "${appPath}" 2>&1 | egrep "Identifier|Authority|TeamIdentifier" || true`,
        ).forEach((line) => {
          logAfterPackProgress(line);
        });

        logAfterPackProgress(
          'DEBUG_SIGNING: verifying nested helper signatures (shallow)',
        );
        const helpersGlob = path.join(appPath, 'Contents/Frameworks', '*.app');
        safeExec(
          `for f in ${helpersGlob}; do echo "--- $f"; codesign -dv "$f" 2>&1 | egrep "Identifier|Authority" || true; done`,
        ).forEach((line) => {
          logAfterPackProgress(line);
        });

        logAfterPackProgress(
          'DEBUG_SIGNING: deep verify (will fail before signing stage)',
        );
        safeExec(
          `codesign --verify --deep --strict --verbose=2 "${appPath}" || true`,
        ).forEach((line) => {
          logAfterPackProgress(line);
        });
      } catch (e) {
        logAfterPackProgress(
          `DEBUG_SIGNING: error during diagnostics: ${e.message || e}`,
        );
      }
    }
  }

  logAfterPackProgress('Completed');
};

/**
 * Removes unused locales for macOS builds.
 * @param {string} appOutDir
 * @param {string} appName
 */
const removeUnusedLocales = (appOutDir, appName) => {
  logAfterPackProgress('removing unused locales');

  const resourcesPath = path.join(
    appOutDir,
    `${appName}.app`,
    'Contents',
    'Frameworks',
    'Electron Framework.framework',
    'Versions',
    'A',
    'Resources',
  );

  // Get all locale directories
  const allLocales = fs
    .readdirSync(resourcesPath)
    .filter((file) => file.endsWith('.lproj'));

  const langLocales = electronLanguages.map((lang) => `${lang}.lproj`);

  // Remove unused locales
  for (const locale of allLocales) {
    if (!langLocales.includes(locale)) {
      const localePath = path.join(resourcesPath, locale);
      fs.rmSync(localePath, { recursive: true });
    }
  }
};

exports.default = afterPack;

function safeExec(cmd) {
  try {
    const out = execSync(cmd, { stdio: 'pipe', maxBuffer: 5 * 1024 * 1024 })
      .toString()
      .trim();
    return out ? out.split('\n') : [];
  } catch (err) {
    const stdout = err?.stdout?.toString()?.trim();
    const stderr = err?.stderr?.toString()?.trim();
    return [
      `Command failed (ignored): ${cmd}`,
      ...(stdout ? stdout.split('\n') : []),
      ...(stderr ? stderr.split('\n') : []),
    ];
  }
}
