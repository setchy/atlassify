const path = require('node:path');
const webpack = require('webpack');
const webpackPaths = require('./webpack.paths');
const baseConfig = require('./webpack.config.common');
const { merge } = require('webpack-merge');

/**
 * @type {webpack.Configuration}
 */
const configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-main',

  entry: [path.join(webpackPaths.srcMainPath, 'main.ts')],

  output: {
    path: webpackPaths.buildPath,
    filename: 'main.js',
  },
};

module.exports = merge(baseConfig, configuration);
