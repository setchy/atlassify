const packageJson = require('../../package.json');

export const APPLICATION = {
  ID: 'com.electron.atlassify',

  NAME: 'Atlassify',

  EVENT_PREFIX: 'atlassify:',

  FIRST_RUN_FOLDER: 'atlassify-first-run',

  WEBSITE: packageJson.homepage,
};
