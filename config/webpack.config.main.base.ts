import path from 'node:path';

import Dotenv from 'dotenv-webpack';
import type webpack from 'webpack';
import { merge } from 'webpack-merge';

import baseConfig from './webpack.config.common';
import webpackPaths from './webpack.paths';

const configuration: webpack.Configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-main',

  entry: [path.join(webpackPaths.srcMainPath, 'index.ts')],

  output: {
    path: webpackPaths.buildPath,
    filename: 'main.js',
  },

  plugins: [new Dotenv()],
};

export default merge(baseConfig, configuration);
