const path = require('node:path');

const rootPath = path.join(__dirname, '..');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');

const releasePath = path.join(rootPath, 'release');

const distPath = path.join(rootPath, 'dist');

const buildPath = path.join(rootPath, 'build');

module.exports = {
  rootPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  releasePath,
  distPath,
  buildPath,
};
