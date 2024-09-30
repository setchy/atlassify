import fs from 'node:fs';
import path from 'node:path';
import { rimrafSync } from 'rimraf';
import webpackPaths from '../config/webpack.paths';

function deleteSourceMaps() {
  if (fs.existsSync(webpackPaths.buildPath)) {
    rimrafSync(path.join(webpackPaths.buildPath, '*.js.map'), {
      glob: true,
    });
  }
}

deleteSourceMaps();
