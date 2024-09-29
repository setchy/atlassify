const path = require('node:path');
const webpack = require('webpack');
const webpackPaths = require('./webpack.paths');
const baseConfig = require('./webpack.config.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {webpack.Configuration}
 */
const configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: [path.join(webpackPaths.srcRendererPath, 'index.tsx')],

  output: {
    path: webpackPaths.buildPath,
    filename: 'renderer.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join('index.html'),
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      // env: process.env.NODE_ENV,
      // isDevelopment: process.env.NODE_ENV !== 'production',
      // nodeModules: webpackPaths.appNodeModulesPath,
    }),
  ],
};

module.exports = merge(baseConfig, configuration);
