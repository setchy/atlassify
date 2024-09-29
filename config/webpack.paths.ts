import path from 'node:path';

const rootPath = path.join(__dirname, '..');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');

const distPath = path.join(rootPath, 'dist');

const buildPath = path.join(rootPath, 'build');

export default {
  rootPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  distPath,
  buildPath,
};
